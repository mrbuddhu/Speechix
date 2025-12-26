@echo off
echo =======================================
echo 🚀 Setting up Speechix Development Environment
echo =======================================

:: Check if .env.local exists, if not create from example
if not exist ".env.local" (
    echo 🔧 Creating .env.local from example...
    copy .env.example .env.local
    echo ✅ Created .env.local - Please update with your configuration
) else (
    echo ℹ️  .env.local already exists, skipping creation
)

:: Navigate to backend directory
cd backend

:: Check if backend .env exists, if not create from example
if not exist ".env" (
    echo 🔧 Creating backend/.env from example...
    copy .env.example .env
    echo ✅ Created backend/.env - Please update with your configuration
) else (
    echo ℹ️  backend/.env already exists, skipping creation
)

:: Create and activate Python virtual environment if it doesn't exist
if not exist "venv" (
    echo 🐍 Setting up Python virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install --upgrade pip
    pip install -r requirements.txt
    echo ✅ Python dependencies installed
) else (
    echo ℹ️  Python virtual environment already exists
    call venv\Scripts\activate.bat
)

:: Go back to project root
cd ..

:: Install frontend dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
    echo ✅ Frontend dependencies installed
) else (
    echo ℹ️  Frontend dependencies already installed
)

echo.
echo ✨ Setup complete!
echo.
echo To start the development servers, open two terminal windows and run:
echo.
echo Terminal 1 (Backend):
echo cd backend
echo call venv\Scripts\activate.bat
echo uvicorn app.main:app --reload
echo.
echo Terminal 2 (Frontend):
echo cd %~dp0
call npm run dev
echo.
echo 🌐 Access the application at: http://localhost:3000
echo 📚 API documentation at: http://localhost:8000/api/docs

:: Keep the window open
pause
