from .socket_manager import sio, active_sessions, broadcast_to_session, emit_to_player
from app.config import get_settings
from app.ai_system.agents.judge_agent import JudgeAgent
from app.ai_system.agents.opponent_agent import OpponentAgent
from app.ai_system.rag.retriever import RAGRetriever
import asyncio

settings = get_settings()
rag = RAGRetriever(api_key=settings.GEMINI_API_KEY)
judge = JudgeAgent(api_key=settings.GEMINI_API_KEY, rag_retriever=rag)
opponent = OpponentAgent(api_key=settings.GEMINI_API_KEY, rag_retriever=rag)

# ── Connection lifecycle ──────────────────────────────────────────────────────

@sio.event
async def connect(sid, environ, auth):
    print(f"[socket] connect  sid={sid}")

@sio.event
async def disconnect(sid):
    # Remove player from whichever session they were in
    for session_id, state in list(active_sessions.items()):
        players = state.get("players", {})
        if sid in players:
            role = players.pop(sid)
            await broadcast_to_session(session_id, "player_left", {
                "role": role, "player_count": len(players)
            })
    print(f"[socket] disconnect  sid={sid}")

# ── Session management ────────────────────────────────────────────────────────

@sio.event
async def join_session(sid, data):
    """
    data = { session_id, role: "plaintiff"|"defense"|"spectator", user_id }
    """
    session_id = data["session_id"]
    role        = data.get("role", "spectator")
    user_id     = data.get("user_id", sid)

    room = f"case:{session_id}"
    await sio.enter_room(sid, room)

    if session_id not in active_sessions:
        active_sessions[session_id] = {
            "players": {},
            "turn": "plaintiff",
            "round": 1,
            "scores": {"plaintiff": 0, "defense": 0},
        }

    state = active_sessions[session_id]
    state["players"][sid] = role

    # Tell the joiner their current state
    await emit_to_player(sid, "session_joined", {
        "session_id": session_id,
        "role": role,
        "current_turn": state["turn"],
        "round": state["round"],
        "scores": state["scores"],
    })

    # Tell everyone else
    await sio.emit("player_joined", {
        "role": role,
        "user_id": user_id,
        "player_count": len(state["players"]),
    }, room=room, skip_sid=sid)


@sio.event
async def leave_session(sid, data):
    session_id = data.get("session_id")
    if session_id and session_id in active_sessions:
        state = active_sessions[session_id]
        role = state["players"].pop(sid, None)
        await sio.leave_room(sid, f"case:{session_id}")
        await broadcast_to_session(session_id, "player_left", {
            "role": role, "player_count": len(state["players"])
        })

# ── Argument submission ───────────────────────────────────────────────────────

@sio.event
async def submit_argument(sid, data):
    """
    data = { session_id, argument_text, case_id }
    Enforces turn order, evaluates with judge, generates opponent reply.
    """
    session_id    = data["session_id"]
    argument_text = data["argument_text"]
    case_id       = data.get("case_id")
    state         = active_sessions.get(session_id)

    if not state:
        await emit_to_player(sid, "error", {"message": "Session not found"})
        return

    player_role = state["players"].get(sid)

    # Enforce turn
    if player_role != state["turn"]:
        await emit_to_player(sid, "error", {
            "message": f"Not your turn. Current turn: {state['turn']}"
        })
        return

    # Acknowledge receipt immediately
    await broadcast_to_session(session_id, "argument_received", {
        "role": player_role,
        "argument": argument_text,
        "round": state["round"],
    })

    # Run AI evaluation in background so we don't block
    asyncio.create_task(_evaluate_and_respond(
        session_id, sid, player_role, argument_text, case_id, state
    ))


async def _evaluate_and_respond(session_id, sid, role, argument, case_id, state):
    try:
        # 1. Judge evaluates
        evaluation = await asyncio.to_thread(
            judge.evaluate_argument,
            argument=argument,
            case_id=case_id,
            player_role=role,
        )

        score_delta = evaluation.get("total_score", 0)
        state["scores"][role] = state["scores"].get(role, 0) + score_delta

        await broadcast_to_session(session_id, "argument_evaluated", {
            "role": role,
            "evaluation": evaluation,
            "scores": state["scores"],
        })

        # 2. AI opponent replies (if playing against AI)
        opponent_role = "defense" if role == "plaintiff" else "plaintiff"
        if opponent_role not in state["players"].values():
            opp_reply = await asyncio.to_thread(
                opponent.generate_counter_argument,
                argument=argument,
                case_id=case_id,
                role=opponent_role,
            )
            await broadcast_to_session(session_id, "opponent_response", {
                "role": opponent_role,
                "argument": opp_reply,
            })

        # 3. Advance turn
        state["turn"] = opponent_role
        state["round"] += 1

        await broadcast_to_session(session_id, "turn_changed", {
            "current_turn": state["turn"],
            "round": state["round"],
            "scores": state["scores"],
        })

        # 4. Check win condition (e.g., 5 rounds)
        if state["round"] > 10:
            winner = max(state["scores"], key=state["scores"].get)
            await broadcast_to_session(session_id, "verdict_reached", {
                "winner": winner,
                "final_scores": state["scores"],
            })

    except Exception as e:
        await broadcast_to_session(session_id, "error", {"message": str(e)})


# ── Utility events ────────────────────────────────────────────────────────────

@sio.event
async def request_hint(sid, data):
    session_id = data.get("session_id")
    question   = data.get("question", "")
    results    = await asyncio.to_thread(rag.retrieve, query=question, n_results=3)
    await emit_to_player(sid, "hint_response", {"hints": results})


@sio.event
async def typing(sid, data):
    """Broadcast 'opponent is typing' indicator."""
    session_id = data.get("session_id")
    role       = active_sessions.get(session_id, {}).get("players", {}).get(sid)
    await sio.emit("player_typing", {"role": role},
                   room=f"case:{session_id}", skip_sid=sid)
