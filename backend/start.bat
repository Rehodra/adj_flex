@echo off

REM Always run from the backend folder where this script lives.
cd /d "%~dp0"

echo [INFO] Working directory: %CD%

set "VENV_DIR="
if exist ".venv-new\Scripts\activate.bat" set "VENV_DIR=.venv-new"
if not defined VENV_DIR if exist ".venv\Scripts\activate.bat" set "VENV_DIR=.venv"

if not defined VENV_DIR (
    echo [INFO] No virtual environment found. Creating .venv ...

    rem Prefer uv if available; fallback to python -m venv.
    where uv >nul 2>&1
    if errorlevel 0 (
        echo [INFO] Creating venv with uv.
        uv venv .venv
    ) else (
        echo [INFO] uv not found, using python -m venv.
        where python >nul 2>&1
        if errorlevel 1 (
            echo [ERROR] Python is not installed or not available in PATH.
            exit /b 1
        )
        python -m venv .venv
    )

    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment.
        exit /b 1
    )

    set "VENV_DIR=.venv"
)

echo [INFO] Using virtual environment: %VENV_DIR%
call "%CD%\%VENV_DIR%\Scripts\activate.bat"
if errorlevel 1 (
    echo [ERROR] Failed to activate virtual environment. Ensure the virtual environment exists and try again.
    exit /b 1
)

:: Upgrade pip and install dependencies
echo [INFO] Upgrading pip and installing dependencies...
pip install --upgrade pip
if errorlevel 1 (
    echo [ERROR] Failed to upgrade pip. Check your Python installation.
    exit /b 1
)

if exist requirements.txt (
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies from requirements.txt. Check the file and try again.
        exit /b 1
    )
) else (
    echo [WARNING] requirements.txt not found. Skipping dependency installation.
)

:: Ensure core backend packages are installed
pip install fastapi uvicorn motor google-auth "pyjwt[crypto]" httpx email-validator pydantic pydantic-settings
if errorlevel 1 (
    echo [ERROR] Failed to install core backend packages. Check your internet connection and try again.
    exit /b 1
)

if not exist ".env" (
    echo [WARNING] .env file not found in backend. Create it if required for your environment.
) else (
    echo [INFO] .env found.
)

echo [SUCCESS] Environment setup complete. Run server with:
echo uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

echo [INFO] Starting server now...
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

exit /b 0
