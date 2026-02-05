# 🚀 Deployment Guide for Spice Hub

## Deploy to Railway (Recommended - FREE)

### Prerequisites
1. Create a [Railway account](https://railway.app)
2. Install [Railway CLI](https://docs.railway.app/develop/cli) (optional)

### Option 1: Deploy via Railway Dashboard (Easiest)

#### Step 1: Deploy Backend
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Connect your GitHub account and select your repository
4. Railway will detect Dockerfile automatically

#### Step 2: Add PostgreSQL Database
1. In your project, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will automatically create and link the database

#### Step 3: Configure Backend Environment Variables
In your backend service settings, add these variables:
```
SECRET_KEY=<generate-a-secure-random-key>
DEBUG=False
DATABASE_ENGINE=postgresql
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
ALLOWED_HOSTS=*.railway.app
CORS_ALLOWED_ORIGINS=https://${{RAILWAY_PUBLIC_DOMAIN}}
```

#### Step 4: Deploy Frontend
1. Click **"New"** → **"GitHub Repo"** → Select your repo again
2. Under **"Settings"** → **"Build"**:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s dist -l $PORT`

Or use the frontend Dockerfile:
   - Dockerfile Path: `frontend/Dockerfile`

#### Step 5: Update Frontend API URL
Before deploying frontend, update the API base URL in your React app:

In `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.railway.app';
```

Add environment variable in Railway frontend service:
```
VITE_API_URL=https://your-backend.railway.app
```

#### Step 6: Update CORS Settings
Once you have your Railway URLs:
1. Go to backend service settings
2. Update `ALLOWED_HOSTS`: `yourdomain.railway.app,*.railway.app`
3. Update `CORS_ALLOWED_ORIGINS`: `https://your-frontend.railway.app`

#### Step 7: Create Admin User
1. Go to backend service
2. Click on **"Settings"** → **"Deploy Logs"**
3. Click **"Open Shell"** (or use Railway CLI)
4. Run:
```bash
python manage.py createsuperuser
```

### Option 2: Deploy via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy backend
railway up --service backend

# Deploy frontend  
railway up --service frontend
```

---

## Alternative: Deploy to Render.com

### Backend (Web Service)
1. Create new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Environment**: Docker
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Add PostgreSQL database** from dashboard
4. Add environment variables (similar to Railway)

### Frontend (Static Site)
1. Create new **Static Site** on Render
2. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

---

## Alternative: Deploy to Vercel (Frontend) + Railway (Backend)

### Backend on Railway (as above)

### Frontend on Vercel
```bash
cd frontend
npx vercel --prod
```

Or deploy via [Vercel Dashboard](https://vercel.com)

---

## Environment Variables Reference

### Backend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| SECRET_KEY | Django secret key | `your-secret-key-here` |
| DEBUG | Debug mode | `False` |
| DATABASE_ENGINE | Database type | `postgresql` |
| DB_NAME | Database name | Railway provides |
| DB_USER | Database user | Railway provides |
| DB_PASSWORD | Database password | Railway provides |
| DB_HOST | Database host | Railway provides |
| DB_PORT | Database port | Railway provides |
| ALLOWED_HOSTS | Allowed domains | `*.railway.app` |
| CORS_ALLOWED_ORIGINS | CORS origins | `https://yourfrontend.railway.app` |

### Frontend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | `https://yourbackend.railway.app` |

---

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Database is connected and migrations ran
- [ ] Created superuser for admin access
- [ ] Frontend is deployed and accessible
- [ ] Frontend can connect to backend API
- [ ] CORS is properly configured
- [ ] Static files are being served
- [ ] HTTPS is enabled (automatic on Railway/Render)
- [ ] Test login/register functionality
- [ ] Test all API endpoints
- [ ] Admin panel is accessible at `/admin`

---

## Useful Commands

### Railway CLI
```bash
# View logs
railway logs

# Open service in browser
railway open

# Run database migrations
railway run python manage.py migrate

# Create superuser
railway run python manage.py createsuperuser

# Access shell
railway shell
```

### Local Testing with Docker
```bash
# Build and run
docker-compose up --build

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# View logs
docker-compose logs -f
```

---

## Troubleshooting

### Database Connection Issues
- Verify database environment variables
- Check if PostgreSQL service is running
- Ensure migrations have run

### CORS Errors
- Update `CORS_ALLOWED_ORIGINS` with your frontend URL
- Update `ALLOWED_HOSTS` with your backend domain
- Ensure `CSRF_TRUSTED_ORIGINS` includes your frontend URL

### Static Files Not Loading
- Run `python manage.py collectstatic`
- Check `STATIC_ROOT` and `STATIC_URL` settings
- Verify whitenoise is installed

### Build Failures
- Check Dockerfile syntax
- Verify all dependencies in requirements.txt
- Check build logs for errors

---

## 📧 Sharing with Client

Once deployed, share these URLs with your client:

**Frontend (User Interface):**
```
https://your-frontend-name.railway.app
```

**Backend API (for reference):**
```
https://your-backend-name.railway.app/api/
```

**Admin Panel:**
```
https://your-backend-name.railway.app/admin/
```

Provide admin credentials separately via secure channel.

---

## Support

For issues:
- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Django: https://docs.djangoproject.com
