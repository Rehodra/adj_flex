import requests
import json

def test_argument():
    # 1. Create session to get valid session_id
    res = requests.post("http://localhost:8000/api/session/create", json={
        "case_id": "CRIM_EASY_1",
        "user_id": "demo_user_001",
        "mode": "criminal"
    })
    
    session_id = res.json().get("session_id")
    print(f"Created Session: {session_id}")
    
    # 2. Submit argument mimicking Simulator.tsx
    payload = {
        "session_id": session_id,
        "argument_text": "Your Honor, this is a test argument that meets the ten character minimum limitation.",
        "cited_sections": ["302"],
        "evidence_references": [],
        "phase": "opening_statement"
    }
    
    print("\nSending Payload:")
    print(json.dumps(payload, indent=2))
    
    resp = requests.post("http://localhost:8000/api/argument/submit", json=payload)
    print(f"\nStatus Code: {resp.status_code}")
    print("Response Body:")
    print(json.dumps(resp.json(), indent=2))

if __name__ == "__main__":
    test_argument()
