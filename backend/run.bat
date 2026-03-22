@echo off

REM Always run from the backend folder where this script lives.
cd /d "%~dp0"

echo [INFO] Running environment setup...
call "%CD%\start.bat"
if errorlevel 1 (
    echo [ERROR] Setup failed. Server will not start.
    exit /b 1
)

echo [INFO] Starting FastAPI server on http://localhost:8000
where uvicorn >nul 2>&1
if errorlevel 1 (
    where uv >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] uvicorn is not available and uv is not found.
        echo         Ensure dependencies are installed correctly.
        exit /b 1
    )
    uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) else (
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
)
