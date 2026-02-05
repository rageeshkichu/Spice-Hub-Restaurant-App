# Spice Hub - Restaurant Website

A full-stack restaurant website built with React frontend and Django backend, featuring online ordering, table reservations, and customer feedback systems.

## 🚀 Features

- **Menu Management**: Browse categorized menu items with pricing options
- **Online Ordering**: Add items to cart, customize portions, and place orders
- **Table Reservations**: Book tables with date and time selection
- **User Authentication**: Register and login functionality
- **Feedback System**: Customer reviews and ratings
- **Contact Forms**: Direct communication with restaurant
- **Blog**: News and updates section
- **Admin Panel**: Django admin for managing content and orders
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Technology Stack

### Backend
- **Django 4.2** - Web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database
- **Gunicorn** - WSGI HTTP Server

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Zustand** - State management
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **Vite** - Build tool

### Deployment
- **Docker & Docker Compose** - Containerization
- **Nginx** - Web server and reverse proxy

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ (or use Docker)
- Docker & Docker Compose (for containerized deployment)

## 🔧 Local Development Setup

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
```

3. **Activate virtual environment:**
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

5. **Create .env file:**
```bash
cp .env.example .env
```

6. **Update .env with your settings:**
```
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=spicehub_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
```

7. **Create PostgreSQL database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE spicehub_db;
```

8. **Run migrations:**
```bash
python manage.py migrate
```

9. **Create superuser:**
```bash
python manage.py createsuperuser
```

10. **Load initial data (optional):**
```bash
python manage.py loaddata fixtures/initial_data.json
```

11. **Run development server:**
```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
cp .env.example .env
```

4. **Update .env:**
```
VITE_API_URL=http://localhost:8000/api
```

5. **Run development server:**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 🐳 Docker Deployment

### Quick Start with Docker Compose

1. **Clone the repository and navigate to project root**

2. **Create environment file:**
```bash
cp .env.example .env
```

3. **Generate a secret key:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

4. **Update .env file with the secret key**

5. **Build and start containers:**
```bash
docker-compose up -d --build
```

6. **Run migrations:**
```bash
docker-compose exec backend python manage.py migrate
```

7. **Create superuser:**
```bash
docker-compose exec backend python manage.py createsuperuser
```

8. **Collect static files:**
```bash
docker-compose exec backend python manage.py collectstatic --noinput
```

Application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api`
- Admin: `http://localhost:8000/admin`

### Docker Commands

```bash
# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Remove containers and volumes
docker-compose down -v
```

## 🌐 Production Deployment

### Option 1: VPS/Cloud Server (Ubuntu/Debian)

#### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt install git -y
```

#### 2. Clone Repository

```bash
cd /opt
sudo git clone https://github.com/yourusername/spicehub.git
cd spicehub
```

#### 3. Configure Environment

```bash
# Create .env file
sudo nano .env
```

Update with production values:
```
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,your-server-ip
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

#### 4. Update Docker Compose for Production

Edit `docker-compose.yml` to use your domain:
```yaml
environment:
  - ALLOWED_HOSTS=your-domain.com,www.your-domain.com
  - CORS_ALLOWED_ORIGINS=https://your-domain.com
```

#### 5. Deploy

```bash
# Build and start
sudo docker-compose up -d --build

# Run migrations
sudo docker-compose exec backend python manage.py migrate

# Create superuser
sudo docker-compose exec backend python manage.py createsuperuser

# Collect static files
sudo docker-compose exec backend python manage.py collectstatic --noinput
```

#### 6. Setup Nginx (Optional - for SSL/domain)

```bash
sudo apt install nginx certbot python3-certbot-nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/spicehub
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /admin/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        proxy_pass http://localhost:8000;
    }

    location /media/ {
        proxy_pass http://localhost:8000;
    }
}
```

Enable site and get SSL:
```bash
sudo ln -s /etc/nginx/sites-available/spicehub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Option 2: Heroku Deployment

1. **Install Heroku CLI**
2. **Create Heroku apps:**
```bash
heroku create spicehub-backend
heroku create spicehub-frontend
```

3. **Add PostgreSQL:**
```bash
heroku addons:create heroku-postgresql:hobby-dev -a spicehub-backend
```

4. **Deploy backend:**
```bash
cd backend
git init
heroku git:remote -a spicehub-backend
git add .
git commit -m "Initial commit"
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

5. **Deploy frontend:** Use Heroku buildpack for Node.js

### Option 3: AWS/DigitalOcean/Other Cloud

Follow similar steps as VPS deployment, adjusting for platform specifics.

## 📊 Database Management

### Backup Database

```bash
# Using Docker
docker-compose exec db pg_dump -U postgres spicehub_db > backup.sql

# Direct PostgreSQL
pg_dump -U postgres spicehub_db > backup.sql
```

### Restore Database

```bash
# Using Docker
docker-compose exec -T db psql -U postgres spicehub_db < backup.sql

# Direct PostgreSQL
psql -U postgres spicehub_db < backup.sql
```

### Create Database Fixtures

```bash
python manage.py dumpdata api --indent 2 > fixtures/initial_data.json
```

## 🔐 Security Checklist

- [ ] Change SECRET_KEY in production
- [ ] Set DEBUG=False
- [ ] Configure ALLOWED_HOSTS
- [ ] Setup CORS properly
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL
- [ ] Setup firewall rules
- [ ] Regular backups
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets

## 📝 Adding Menu Items

1. Login to admin panel: `http://your-domain.com/admin`
2. Navigate to Categories → Add Category
3. Navigate to Menu Items → Add Menu Item
4. Add prices for different portions (starter, main, etc.)

## 🔄 Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild containers
docker-compose up -d --build

# Run migrations
docker-compose exec backend python manage.py migrate

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput
```

## 🐛 Troubleshooting

### Database Connection Issues
- Check PostgreSQL is running
- Verify database credentials in .env
- Ensure database exists

### Frontend Not Loading
- Check if backend API is accessible
- Verify VITE_API_URL in frontend .env
- Check browser console for errors

### CORS Errors
- Update CORS_ALLOWED_ORIGINS in backend settings
- Ensure frontend URL is whitelisted

### Static Files Not Loading
- Run `python manage.py collectstatic`
- Check STATIC_ROOT and STATIC_URL settings

## 📞 Support

For issues or questions:
- Email: your-email@example.com
- GitHub Issues: [repository-url]

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Development Team

Created for Spice Hub - Indian Cuisine

---

**Note**: Remember to update all placeholder values (domains, emails, credentials) with your actual production values before deploying.
