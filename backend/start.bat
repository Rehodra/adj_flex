@echo off

:: Ensure the script runs from the backend directory
cd /d "%~dp0"

:: Check Python version
python --version 2>nul | findstr "3.10" >nul
if errorlevel 1 (
    echo [ERROR] Python 3.10 is required. Please install Python 3.10 and ensure it is added to your PATH.
    exit /b 1
)

:: Check if virtual environment exists
set "VENV_DIR=.venv-new"
if not exist "%VENV_DIR%\Scripts\activate.bat" (
    echo [INFO] No virtual environment found. Creating .venv-new...
    python -m venv %VENV_DIR%
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment. Ensure Python 3.10 is installed and try again.
        exit /b 1
    )
)

:: Activate virtual environment
call "%VENV_DIR%\Scripts\activate.bat"
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

echo [SUCCESS] Environment setup complete. You can now run the server using run.bat or the command below:
echo uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

exit /b 0
