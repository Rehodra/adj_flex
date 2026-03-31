import socketio
from datetime import datetime
from typing import Dict, Any

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",       # tighten in production
    logger=False,
    engineio_logger=False,
)

# In-memory room state (migrate to Redis for multi-process prod)
active_sessions: Dict[str, Dict[str, Any]] = {}

def get_sio():
    return sio

async def broadcast_to_session(session_id: str, event: str, data: dict):
    """Emit to everyone in the case room."""
    await sio.emit(event, data, room=f"case:{session_id}")

async def emit_to_player(sid: str, event: str, data: dict):
    """Emit to a single connected socket."""
    await sio.emit(event, data, to=sid)
