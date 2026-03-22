#!/usr/bin/env python3
"""
Setup script for AI Legal Courtroom Simulator Backend
Uses UV for virtual environment management and dependency installation
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path


def run_command(cmd: str, check: bool = True, capture_output: bool = False) -> subprocess.CompletedProcess:
    """Run a shell command"""
    print(f"🔧 Running: {cmd}")
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            check=check,
            capture_output=capture_output,
            text=True
        )
        return result
    except subprocess.CalledProcessError as e:
        print(f"❌ Command failed: {cmd}")
        print(f"Error: {e}")
        if not capture_output:
            print(f"Return code: {e.returncode}")
        raise


def check_uv_installed() -> bool:
    """Check if UV is installed"""
    try:
        result = run_command("uv --version", check=True, capture_output=True)
        print(f"✅ UV found: {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError:
        print("❌ UV not found. Please install UV with: pip install uv")
        return False


def create_virtual_environment() -> None:
    """Create virtual environment with UV"""
    print("🏗️  Creating virtual environment...")
    
    venv_path = Path(".venv")
    if venv_path.exists():
        print("⚠️  Virtual environment already exists. Skipping creation.")
        return
    
    run_command("uv venv", check=True)
    print("✅ Virtual environment created successfully")


def activate_venv_command() -> str:
    """Get the command to activate virtual environment"""
    if os.name == 'nt':  # Windows
        return ".venv\\Scripts\\activate"
    else:  # Linux/Mac
        return "source .venv/bin/activate"


def install_dependencies() -> None:
    """Install dependencies using UV"""
    print("📦 Installing dependencies...")
    
    # Install basic dependencies first
    run_command("uv pip install -r requirements.txt", check=True)
    print("✅ Dependencies installed successfully")


def setup_environment() -> None:
    """Setup environment file"""
    env_file = Path(".env")
    env_example = Path(".env.example")
    
    if not env_file.exists() and env_example.exists():
        print("📝 Creating .env file from template...")
        with open(env_example, 'r') as f:
            content = f.read()
        with open(env_file, 'w') as f:
            f.write(content)
        print("✅ .env file created")
        print("⚠️  Please edit .env file and add your GOOGLE_API_KEY")
    elif env_file.exists():
        print("✅ .env file already exists")
    else:
        print("⚠️  No .env.example file found")


def index_documents() -> None:
    """Index legal documents"""
    print("📚 Indexing legal documents...")
    
    try:
        run_command("uv run python scripts/index_legal_docs.py", check=True)
        print("✅ Documents indexed successfully")
    except subprocess.CalledProcessError as e:
        print(f"⚠️  Document indexing failed: {e}")
        print("You can run this manually later with: uv run python scripts/index_legal_docs.py")


def test_setup() -> None:
    """Test the setup by importing components"""
    print("🧪 Testing setup...")
    
    test_commands = [
        ("RAG System", "uv run python -c \"from app.ai_system.rag.retriever import RAGRetriever; print('✅ RAG System OK')\""),
        ("Judge Agent", "uv run python -c \"from app.ai_system.agents.judge_agent import JudgeAgent; print('✅ Judge Agent OK')\""),
        ("Opponent Agent", "uv run python -c \"from app.ai_system.agents.opponent_agent import OpponentAgent; print('✅ Opponent Agent OK')\"")
    ]
    
    for name, cmd in test_commands:
        try:
            run_command(cmd, check=True)
        except subprocess.CalledProcessError as e:
            print(f"❌ {name} test failed: {e}")
            return False
    
    print("✅ All tests passed!")
    return True


def main() -> None:
    """Main setup function"""
    parser = argparse.ArgumentParser(description="Setup AI Legal Courtroom Simulator Backend")
    parser.add_argument("--skip-env", action="store_true", help="Skip environment setup")
    parser.add_argument("--skip-index", action="store_true", help="Skip document indexing")
    parser.add_argument("--skip-test", action="store_true", help="Skip setup testing")
    
    args = parser.parse_args()
    
    print("🚀 Setting up AI Legal Courtroom Simulator Backend...")
    print("=" * 60)
    
    # Check UV
    if not check_uv_installed():
        sys.exit(1)
    
    # Create virtual environment
    create_virtual_environment()
    
    # Install dependencies
    install_dependencies()
    
    # Setup environment
    if not args.skip_env:
        setup_environment()
    
    # Index documents
    if not args.skip_index:
        index_documents()
    
    # Test setup
    if not args.skip_test:
        test_setup()
    
    print("\n" + "=" * 60)
    print("🎉 Setup completed successfully!")
    print("\n📋 Next Steps:")
    print("1. Activate virtual environment:")
    print(f"   {activate_venv_command()}")
    print("2. Edit .env file and add your GOOGLE_API_KEY")
    print("3. Start the server:")
    print("   uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
    print("4. Access API docs at: http://localhost:8000/docs")


if __name__ == "__main__":
    main()
