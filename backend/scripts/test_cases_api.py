import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_tests():
    print("Testing /api/cases/types")
    response = client.get("/api/cases/types")
    print(f"Status: {response.status_code}")
    print(response.json())
    print("-" * 50)
    
    print("Testing /api/cases/list")
    response = client.get("/api/cases/list?type=criminal&difficulty=easy")
    print(f"Status: {response.status_code}")
    print(response.json())
    print("-" * 50)
    
    print("Testing /api/session/available/cases")
    response = client.get("/api/session/available/cases")
    print(f"Status: {response.status_code}")
    total = response.json().get("total_cases", 0)
    print(f"Total available cases in session route: {total}")
    print("-" * 50)
    
    if response.status_code == 200 and total == 15:
        print("✅ ALL TESTS PASSED!")
    else:
        print("❌ TESTS FAILED")

if __name__ == "__main__":
    run_tests()
