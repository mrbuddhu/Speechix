#!/bin/bash

# Print header
echo "🚀 Setting up Speechix Development Environment"
echo "======================================="

# Check if .env.local exists, if not create from example
if [ ! -f ".env.local" ]; then
    echo "🔧 Creating .env.local from example..."
    cp .env.example .env.local
    echo "✅ Created .env.local - Please update with your configuration"
else
    echo "ℹ️  .env.local already exists, skipping creation"
fi

# Navigate to backend directory
cd backend

# Check if backend .env exists, if not create from example
if [ ! -f ".env" ]; then
    echo "🔧 Creating backend/.env from example..."
    cp .env.example .env
    echo "✅ Created backend/.env - Please update with your configuration"
else
    echo "ℹ️  backend/.env already exists, skipping creation"
fi

# Install backend dependencies if not already installed
if [ ! -d "venv" ]; then
    echo "🐍 Setting up Python virtual environment..."
    python -m venv venv
    source venv/bin/activate  # On Windows, use: .\venv\Scripts\activate
    pip install --upgrade pip
    pip install -r requirements.txt
    echo "✅ Python dependencies installed"
else
    echo "ℹ️  Python virtual environment already exists"
fi

# Go back to project root
cd ..

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    echo "✅ Frontend dependencies installed"
else
    echo "ℹ️  Frontend dependencies already installed"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the development servers, run:"
echo ""
echo "Terminal 1 (Backend):"
echo "cd backend"
echo "source venv/bin/activate  # On Windows: .\\venv\\Scripts\\activate"
echo "uvicorn app.main:app --reload"
echo ""
echo "Terminal 2 (Frontend):"
echo "npm run dev"
echo ""
echo "🌐 Access the application at: http://localhost:3000"
echo "📚 API documentation at: http://localhost:8000/api/docs"
