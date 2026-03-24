"""
Session Management API Routes for AI Legal Courtroom Simulator
Handles session creation, retrieval, and management
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, List, Optional
import uuid
from datetime import datetime, timedelta

from app.models.schemas import (
    SessionCreateRequest,
    SessionResponse,
    ErrorResponse,
    SuccessResponse,
    GameMode,
    CourtPhase,
    PerformanceTier,
    CaseFacts
)
from app.services.scoring_service import ScoringService
from app.db import db

router = APIRouter(tags=["session"])

import os
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'data', 'cases'))

def get_all_cases() -> List[Dict]:
    index_path = os.path.join(BASE_DIR, "case_index.json")
    if not os.path.exists(index_path):
        return []
    with open(index_path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_case_by_id(case_id: str) -> Optional[Dict]:
    file_path = os.path.join(BASE_DIR, f"{case_id}.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return None


@router.post("/create", response_model=SessionResponse)
async def create_session(request: SessionCreateRequest):
    """
    Create a new game session
    
    Args:
        request: Session creation request with case_id, user_id, and mode
        
    Returns:
        SessionResponse with session details and case facts
    """
    try:
        # Generate unique session ID
        session_id = str(uuid.uuid4())
        
        # Load case facts from database
        case_facts = load_case_facts(request.case_id, request.mode)
        
        if not case_facts:
            raise HTTPException(
                status_code=404,
                detail=f"Case with ID {request.case_id} not found"
            )
        
        # Create session state
        session_data = {
            "session_id": session_id,
            "case_id": request.case_id,
            "user_id": request.user_id,
            "mode": request.mode.value if hasattr(request.mode, 'value') else request.mode,
            "current_phase": CourtPhase.OPENING_STATEMENT.value,
            "case_facts": case_facts.dict(),
            "arguments": [],
            "total_score": 0.0,
            "performance_tier": PerformanceTier.LAW_STUDENT.value,
            "created_at": datetime.utcnow(),
            "last_activity": datetime.utcnow(),
            "difficulty": request.difficulty
        }
        
        # Store session in MongoDB
        await db.db.sessions.insert_one(session_data)
        
        # Return session response
        return SessionResponse(
            session_id=session_id,
            case_id=request.case_id,
            user_id=request.user_id,
            mode=request.mode,
            current_phase=CourtPhase.OPENING_STATEMENT,
            case_facts=case_facts.dict(),
            score=0.0,
            performance_tier=PerformanceTier.LAW_STUDENT,
            created_at=session_data["created_at"],
            last_activity=session_data["last_activity"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating session: {str(e)}"
        )


@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(session_id: str):
    """
    Get session details by session ID
    
    Args:
        session_id: Unique session identifier
        
    Returns:
        SessionResponse with current session state
    """
    try:
        session_data = await db.db.sessions.find_one({"session_id": session_id})
        if not session_data:
            raise HTTPException(
                status_code=404,
                detail="Session not found"
            )
        
        # Update last activity
        await db.db.sessions.update_one(
            {"session_id": session_id},
            {"$set": {"last_activity": datetime.utcnow()}}
        )
        
        # Calculate current performance tier
        if session_data["arguments"]:
            avg_score = session_data["total_score"] / len(session_data["arguments"])
            performance_tier = ScoringService.get_performance_tier(avg_score)
        else:
            performance_tier = PerformanceTier.LAW_STUDENT
        
        return SessionResponse(
            session_id=session_data["session_id"],
            case_id=session_data["case_id"],
            user_id=session_data["user_id"],
            mode=session_data["mode"],
            current_phase=session_data["current_phase"],
            case_facts=session_data["case_facts"],
            score=session_data["total_score"],
            performance_tier=performance_tier,
            created_at=session_data["created_at"],
            last_activity=session_data["last_activity"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving session: {str(e)}"
        )


@router.put("/{session_id}/phase")
async def update_session_phase(
    session_id: str,
    new_phase: CourtPhase
):
    """
    Update the current phase of a session
    
    Args:
        session_id: Unique session identifier
        new_phase: New courtroom phase
        
    Returns:
        Success response
    """
    try:
        session_data = await db.db.sessions.find_one({"session_id": session_id})
        if not session_data:
            raise HTTPException(
                status_code=404,
                detail="Session not found"
            )
        
        old_phase = session_data["current_phase"]
        
        # Validate phase progression
        if not is_valid_phase_transition(old_phase, new_phase):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid phase transition from {old_phase} to {new_phase}"
            )
        
        # Update phase
        await db.db.sessions.update_one(
            {"session_id": session_id},
            {"$set": {
                "current_phase": new_phase.value if hasattr(new_phase, 'value') else new_phase,
                "last_activity": datetime.utcnow()
            }}
        )
        
        return SuccessResponse(
            message=f"Session phase updated from {old_phase} to {new_phase}",
            data={
                "session_id": session_id,
                "old_phase": old_phase,
                "new_phase": new_phase
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating session phase: {str(e)}"
        )


@router.delete("/{session_id}")
async def delete_session(session_id: str):
    """
    Delete a session
    
    Args:
        session_id: Unique session identifier
        
    Returns:
        Success response
    """
    try:
        session_data = await db.db.sessions.find_one({"session_id": session_id})
        if not session_data:
            raise HTTPException(
                status_code=404,
                detail="Session not found"
            )
        
        # Store session info for response
        session_info = {
            "session_id": session_id,
            "case_id": session_data["case_id"],
            "user_id": session_data["user_id"],
            "total_arguments": len(session_data.get("arguments", [])),
            "final_score": session_data.get("total_score", 0.0)
        }
        
        # Delete session
        await db.db.sessions.delete_one({"session_id": session_id})
        
        return SuccessResponse(
            message="Session deleted successfully",
            data=session_info
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting session: {str(e)}"
        )


@router.get("/user/{user_id}")
async def get_user_sessions(user_id: str):
    """
    Get all sessions for a specific user
    
    Args:
        user_id: User identifier
        
    Returns:
        List of session summaries
    """
    try:
        user_sessions = []
        
        cursor = db.db.sessions.find({"user_id": user_id})
        async for session_data in cursor:
            session_id = session_data["session_id"]
            # Calculate performance tier
            if session_data.get("arguments"):
                avg_score = session_data.get("total_score", 0.0) / len(session_data["arguments"])
                performance_tier = ScoringService.get_performance_tier(avg_score)
            else:
                performance_tier = PerformanceTier.LAW_STUDENT
            
            session_summary = {
                "session_id": session_id,
                "case_id": session_data["case_id"],
                "mode": session_data["mode"],
                "current_phase": session_data["current_phase"],
                "total_arguments": len(session_data.get("arguments", [])),
                "score": session_data.get("total_score", 0.0),
                "performance_tier": performance_tier,
                "created_at": session_data["created_at"],
                "last_activity": session_data["last_activity"]
            }
            user_sessions.append(session_summary)
        
        # Sort by last activity (most recent first)
        user_sessions.sort(key=lambda x: x["last_activity"], reverse=True)
        
        return {
            "user_id": user_id,
            "total_sessions": len(user_sessions),
            "sessions": user_sessions
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving user sessions: {str(e)}"
        )


@router.get("/available/cases")
async def get_available_cases():
    """
    Get list of available cases for new sessions
    
    Returns:
        List of available cases with brief descriptions
    """
    try:
        available_cases = []
        
        cases_list = get_all_cases()
        
        for case in cases_list:
            case_data = get_case_by_id(case["id"])
            if case_data:
                case_summary = {
                    "case_id": case_data["id"],
                    "title": case_data["title"],
                    "type": case_data["type"],
                    "charges": case_data.get("laws_invoked", []),
                    "difficulty": case_data.get("difficulty", "medium"),
                    "estimated_duration": "30-45 minutes",
                    "legal_areas": case_data.get("laws_invoked", [])[:3]
                }
                available_cases.append(case_summary)
        
        return {
            "total_cases": len(available_cases),
            "cases": available_cases
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving available cases: {str(e)}"
        )


@router.get("/stats")
async def get_session_stats():
    """
    Get overall session statistics
    
    Returns:
        Session statistics
    """
    try:
        total_sessions = await db.db.sessions.count_documents({})
        
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        active_sessions = await db.db.sessions.count_documents({
            "last_activity": {"$gte": one_hour_ago}
        })
        
        # Calculate statistics by mode (Could use aggregation framework for efficiency)
        mode_stats = {}
        for mode in GameMode:
            mode_count = await db.db.sessions.count_documents({"mode": mode.value})
            # To get average score easily, aggregate
            pipeline = [
                {"$match": {"mode": mode.value}},
                {"$group": {"_id": None, "avg_score": {"$avg": "$total_score"}}}
            ]
            agg_result = await db.db.sessions.aggregate(pipeline).to_list(length=1)
            avg_score = agg_result[0]["avg_score"] if agg_result else 0.0
            
            mode_stats[mode.value] = {
                "total": mode_count,
                "average_score": avg_score
            }
        
        return {
            "total_sessions": total_sessions,
            "active_sessions": active_sessions,
            "sessions_by_mode": mode_stats,
            "timestamp": datetime.utcnow()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving session stats: {str(e)}"
        )


# Helper functions
def load_case_facts(case_id: str, mode: GameMode) -> Optional[CaseFacts]:
    """
    Load case facts from database
    
    Args:
        case_id: Case identifier
        mode: Game mode
        
    Returns:
        CaseFacts object or None if not found
    """
    case_data = get_case_by_id(case_id)
    if case_data:
        # Transform JSON to match CaseFacts schema
        mapped_data = {
            "case_id": case_data.get("id", case_id),
            "title": case_data.get("title", ""),
            "type": case_data.get("type", mode.value),
            "charges": case_data.get("laws_invoked", []),
            "facts": case_data.get("description", ""),
            "evidence": case_data.get("evidence", []),
            "legal_provisions": case_data.get("laws_invoked", [])
        }
        return CaseFacts(**mapped_data)
    return None


def is_valid_phase_transition(old_phase: CourtPhase, new_phase: CourtPhase) -> bool:
    """
    Validate if phase transition is allowed
    
    Args:
        old_phase: Current phase
        new_phase: Proposed new phase
        
    Returns:
        True if transition is valid
    """
    # Define allowed transitions
    phase_order = [
        CourtPhase.OPENING_STATEMENT,
        CourtPhase.ARGUMENT,
        CourtPhase.CROSS_EXAMINATION,
        CourtPhase.CLOSING_STATEMENT,
        CourtPhase.JUDGMENT
    ]
    
    try:
        old_index = phase_order.index(old_phase)
        new_index = phase_order.index(new_phase)
        
        # Allow moving forward or staying in same phase (for flexibility)
        return new_index >= old_index
    except ValueError:
        return False


# Dependency injection for session validation
async def get_valid_session(session_id: str) -> Dict:
    """
    Validate and retrieve session
    
    Args:
        session_id: Session identifier
        
    Returns:
        Session data
        
    Raises:
        HTTPException: If session not found
    """
    session_data = await db.db.sessions.find_one({"session_id": session_id})
    if not session_data:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )
    
    # Update last activity
    await db.db.sessions.update_one(
        {"session_id": session_id},
        {"$set": {"last_activity": datetime.utcnow()}}
    )
    return session_data
