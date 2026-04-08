#!/usr/bin/env python
"""
WebSocket Setup Verification Script
Checks if all components are correctly installed and configured
"""

import os
import sys
from pathlib import Path

def check_backend_files():
    """Check if all backend socket files exist"""
    print("\n📋 Checking Backend Files...")
    backend_root = Path("backend")
    
    required_files = [
        "app/sockets/__init__.py",
        "app/sockets/socket_manager.py",
        "app/sockets/events.py",
        "requirements.txt",
        ".env.example",
    ]
    
    all_exist = True
    for file in required_files:
        filepath = backend_root / file
        exists = "✅" if filepath.exists() else "❌"
        print(f"  {exists} {file}")
        if not filepath.exists():
            all_exist = False
    
    return all_exist

def check_frontend_files():
    """Check if all frontend socket files exist"""
    print("\n📋 Checking Frontend Files...")
    frontend_root = Path("frontend")
    
    required_files = [
        "src/api/gameSocket.ts",
        "src/components/GameRoom.tsx",
        "package.json",
    ]
    
    all_exist = True
    for file in required_files:
        filepath = frontend_root / file
        exists = "✅" if filepath.exists() else "❌"
        print(f"  {exists} {file}")
        if not filepath.exists():
            all_exist = False
    
    return all_exist

def check_documentation():
    """Check if documentation files exist"""
    print("\n📚 Checking Documentation...")
    
    doc_files = [
        "WEBSOCKET_SETUP_GUIDE.md",
        "WEBSOCKET_QUICKSTART.md",
        "WEBSOCKET_IMPLEMENTATION_SUMMARY.md",
    ]
    
    all_exist = True
    for file in doc_files:
        exists = "✅" if Path(file).exists() else "❌"
        print(f"  {exists} {file}")
        if not Path(file).exists():
            all_exist = False
    
    return all_exist

def check_dependencies():
    """Check if required packages are installed"""
    print("\n📦 Checking Dependencies...")
    
    backend_packages = {
        "socketio": "python-socketio>=5.11.0",
        "engineio": "python-engineio>=4.9.0",
    }
    
    all_installed = True
    for package, import_name in backend_packages.items():
        try:
            __import__(package)
            print(f"  ✅ {import_name}")
        except ImportError:
            print(f"  ❌ {import_name} (not installed)")
            all_installed = False
    
    # Check FastAPI
    try:
        import fastapi
        print(f"  ✅ fastapi")
    except ImportError:
        print(f"  ❌ fastapi (not installed)")
        all_installed = False
    
    # Check uvicorn
    try:
        import uvicorn
        print(f"  ✅ uvicorn")
    except ImportError:
        print(f"  ❌ uvicorn (not installed)")
        all_installed = False
    
    return all_installed

def check_main_app():
    """Check if main.py has socket integration"""
    print("\n🔌 Checking main.py Integration...")
    
    main_file = Path("backend/app/main.py")
    if not main_file.exists():
        print("  ❌ main.py not found")
        return False
    
    content = main_file.read_text()
    checks = {
        "Socket.io import": "from app.sockets.socket_manager import get_sio" in content,
        "Events import": "from app.sockets import events" in content,
        "ASGIApp import": "from socketio import ASGIApp" in content,
        "Socket initialization": "sio = get_sio()" in content,
        "ASGI wrapper": "socket_asgi_app = ASGIApp" in content,
        "WebSocket URL logged": 'WebSocket:' in content,
    }
    
    all_ok = True
    for check_name, result in checks.items():
        status = "✅" if result else "❌"
        print(f"  {status} {check_name}")
        if not result:
            all_ok = False
    
    return all_ok

def check_events_file():
    """Check if events.py has all required handlers"""
    print("\n🎮 Checking Event Handlers...")
    
    events_file = Path("backend/app/sockets/events.py")
    if not events_file.exists():
        print("  ❌ events.py not found")
        return False
    
    content = events_file.read_text()
    handlers = {
        "connect": "@sio.event" in content and "async def connect" in content,
        "disconnect": "async def disconnect" in content,
        "join_session": "async def join_session" in content,
        "submit_argument": "async def submit_argument" in content,
        "request_hint": "async def request_hint" in content,
        "typing": "async def typing" in content,
    }
    
    all_ok = True
    for handler_name, exists in handlers.items():
        status = "✅" if exists else "❌"
        print(f"  {status} {handler_name} handler")
        if not exists:
            all_ok = False
    
    return all_ok

def check_frontend_config():
    """Check frontend package.json"""
    print("\n⚙️ Checking Frontend Configuration...")
    
    package_file = Path("frontend/package.json")
    if not package_file.exists():
        print("  ❌ package.json not found")
        return False
    
    content = package_file.read_text()
    checks = {
        "socket.io-client dependency": "socket.io-client" in content,
    }
    
    all_ok = True
    for check_name, result in checks.items():
        status = "✅" if result else "❌"
        print(f"  {status} {check_name}")
        if not result:
            all_ok = False
    
    return all_ok

def print_summary(checks: dict):
    """Print verification summary"""
    print("\n" + "="*50)
    print("VERIFICATION SUMMARY")
    print("="*50)
    
    passed = sum(1 for result in checks.values() if result)
    total = len(checks)
    
    for check_name, result in checks.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} - {check_name}")
    
    print(f"\nResult: {passed}/{total} checks passed")
    
    if passed == total:
        print("\n🎉 All checks passed! WebSocket is ready to use.")
        print("\nNext steps:")
        print("  1. cd backend && python -m uvicorn app.main:app --reload")
        print("  2. cd frontend && npm start")
        print("  3. Visit https://adj-flex.vercel.app")
        return True
    else:
        print(f"\n⚠️  {total - passed} check(s) failed. See details above.")
        print("\nFix issues and run this script again.")
        return False

def main():
    """Run all verifications"""
    print("\n" + "="*50)
    print("WebSocket Setup Verification")
    print("="*50)
    
    os.chdir(Path(__file__).parent)
    
    checks = {
        "Backend Files": check_backend_files(),
        "Frontend Files": check_frontend_files(),
        "Documentation": check_documentation(),
        "Backend Dependencies": check_dependencies(),
        "Main App Integration": check_main_app(),
        "Event Handlers": check_events_file(),
        "Frontend Config": check_frontend_config(),
    }
    
    success = print_summary(checks)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
