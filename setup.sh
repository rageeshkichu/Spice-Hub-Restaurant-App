#!/bin/bash

# Spice Hub - Initial Setup Script
# This script sets up the development environment

set -e

echo "🍛 Spice Hub - Initial Setup"
echo "================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose found"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    
    # Generate secret key
    SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
    
    # Update .env with generated secret key
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/SECRET_KEY=.*/SECRET_KEY=$SECRET_KEY/" .env
    else
        sed -i "s/SECRET_KEY=.*/SECRET_KEY=$SECRET_KEY/" .env
    fi
    
    echo "✅ .env file created with generated secret key"
else
    echo "ℹ️  .env file already exists"
fi

# Create frontend .env file if it doesn't exist
if [ ! -f frontend/.env ]; then
    echo "📝 Creating frontend/.env file..."
    cp frontend/.env.example frontend/.env
    echo "✅ Frontend .env file created"
else
    echo "ℹ️  Frontend .env file already exists"
fi

# Create backend .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/.env.example backend/.env
    echo "✅ Backend .env file created"
else
    echo "ℹ️  Backend .env file already exists"
fi

echo ""
echo "🚀 Building Docker containers..."
docker-compose up -d --build

echo ""
echo "⏳ Waiting for database to be ready..."
sleep 10

echo ""
echo "📊 Running database migrations..."
docker-compose exec -T backend python manage.py migrate

echo ""
echo "📦 Collecting static files..."
docker-compose exec -T backend python manage.py collectstatic --noinput

echo ""
echo "================================"
echo "✅ Setup completed successfully!"
echo ""
echo "🌐 Your application is now running:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000/api"
echo "   Admin Panel: http://localhost:8000/admin"
echo ""
echo "👤 To create an admin user, run:"
echo "   docker-compose exec backend python manage.py createsuperuser"
echo ""
echo "📋 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop the application:"
echo "   docker-compose down"
echo ""
echo "Happy coding! 🎉"
