@echo off

REM Always run from the backend folder where this script lives.
cd /d "%~dp0"

echo [INFO] Working directory: %CD%

set "VENV_DIR="
if exist ".venv-new\Scripts\activate.bat" set "VENV_DIR=.venv-new"
if not defined VENV_DIR if exist ".venv\Scripts\activate.bat" set "VENV_DIR=.venv"

if not defined VENV_DIR (
    echo [INFO] No virtual environment found. Creating .venv using uv...
    where uv >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] uv is not installed or not available in PATH.
        echo         Install uv first: https://docs.astral.sh/uv/getting-started/installation/
        exit /b 1
    )

    uv venv .venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment with uv.
        exit /b 1
    )

    set "VENV_DIR=.venv"
)

echo [INFO] Using virtual environment: %VENV_DIR%
call "%CD%\%VENV_DIR%\Scripts\activate.bat"
if errorlevel 1 (
    echo [ERROR] Failed to activate virtual environment.
    exit /b 1
)

if not exist "requirements.txt" (
    echo [ERROR] requirements.txt not found in %CD%
    exit /b 1
)

echo [INFO] Installing dependencies from requirements.txt...
where uv >nul 2>&1
if errorlevel 1 (
    pip install -r requirements.txt
) else (
    uv pip install -r requirements.txt
)

if errorlevel 1 (
    echo [ERROR] Dependency installation failed.
    exit /b 1
)

echo [SUCCESS] Environment is ready.
echo [INFO] Virtual environment is active in this terminal session.
echo [INFO] To run the API: uvicorn app.main:app --reload
