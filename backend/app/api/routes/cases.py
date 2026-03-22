from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import os
import json

router = APIRouter()

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'data', 'cases'))

def get_case_index():
    index_path = os.path.join(BASE_DIR, "case_index.json")
    if not os.path.exists(index_path):
        return []
    with open(index_path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/types")
async def get_case_types():
    """Return available case types and difficulties"""
    return {
        "types": ["criminal", "civil", "constitutional"],
        "difficulties": ["easy", "medium", "hard"]
    }

@router.get("/list")
async def list_cases(
    type: Optional[str] = Query(None, description="Filter by case type"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty level")
):
    """List available cases, optionally filtered by type and difficulty"""
    cases = get_case_index()
    
    if type:
        cases = [c for c in cases if c.get("type") == type.lower()]
    if difficulty:
        cases = [c for c in cases if c.get("difficulty") == difficulty.lower()]
        
    return cases

@router.get("/{case_id}")
async def get_case_details(case_id: str):
    """Get full details of a specific case by ID"""
    file_path = os.path.join(BASE_DIR, f"{case_id}.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Case not found")
        
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)
