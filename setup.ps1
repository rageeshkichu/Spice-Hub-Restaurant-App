# Spice Hub - Initial Setup Script for Windows
# This script sets up the development environment

Write-Host "🍛 Spice Hub - Initial Setup" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker and Docker Compose found" -ForegroundColor Green

# Create .env file if it doesn't exist
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    
    # Generate secret key
    $SECRET_KEY = python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
    
    # Update .env with generated secret key
    (Get-Content .env) -replace 'SECRET_KEY=.*', "SECRET_KEY=$SECRET_KEY" | Set-Content .env
    
    Write-Host "✅ .env file created with generated secret key" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .env file already exists" -ForegroundColor Cyan
}

# Create frontend .env file if it doesn't exist
if (-not (Test-Path frontend\.env)) {
    Write-Host "📝 Creating frontend/.env file..." -ForegroundColor Yellow
    Copy-Item frontend\.env.example frontend\.env
    Write-Host "✅ Frontend .env file created" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Frontend .env file already exists" -ForegroundColor Cyan
}

# Create backend .env file if it doesn't exist
if (-not (Test-Path backend\.env)) {
    Write-Host "📝 Creating backend/.env file..." -ForegroundColor Yellow
    Copy-Item backend\.env.example backend\.env
    Write-Host "✅ Backend .env file created" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Backend .env file already exists" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🚀 Building Docker containers..." -ForegroundColor Yellow
docker-compose up -d --build

Write-Host ""
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "📊 Running database migrations..." -ForegroundColor Yellow
docker-compose exec -T backend python manage.py migrate

Write-Host ""
Write-Host "📦 Collecting static files..." -ForegroundColor Yellow
docker-compose exec -T backend python manage.py collectstatic --noinput

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✅ Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your application is now running:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:8000/api" -ForegroundColor White
Write-Host "   Admin Panel: http://localhost:8000/admin" -ForegroundColor White
Write-Host ""
Write-Host "👤 To create an admin user, run:" -ForegroundColor Cyan
Write-Host "   docker-compose exec backend python manage.py createsuperuser" -ForegroundColor White
Write-Host ""
Write-Host "📋 To view logs:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop the application:" -ForegroundColor Cyan
Write-Host "   docker-compose down" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Green
