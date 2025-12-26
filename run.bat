@echo off
echo Starting Speechix Development Environment...
echo =======================================

:: Create .env files if they don't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
)

if not exist "backend\.env" (
    echo Creating backend/.env file...
    copy backend\.env.example backend\.env
)

:: Start backend in a new window
echo Starting Backend Server...
start "Speechix Backend" cmd /k "cd /d c:\Users\msbuddhu\Desktop\Speechix\backend && .\venv\Scripts\activate && uvicorn app.main:app --reload"

echo Starting Frontend Server...
start "Speechix Frontend" cmd /k "cd /d c:\Users\msbuddhu\Desktop\Speechix && npm install && npm run dev"

echo.
echo 🚀 Development servers are starting in new windows...
echo.
echo 🌐 Frontend: http://localhost:3000
echo 📖 API docs: http://localhost:8000/api/docs
echo.
echo Press any key to exit this window (servers will keep running)...
pause >nul
