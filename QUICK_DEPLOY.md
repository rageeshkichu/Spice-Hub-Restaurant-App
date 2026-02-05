# 🚀 Quick Deployment Steps

## Railway Deployment (5 Minutes)

### 1. Create Railway Account
Go to https://railway.app and sign up with GitHub

### 2. Deploy Backend + Database

1. Click **"New Project"**
2. Click **"Deploy from GitHub repo"**
3. Select **"rageeshkichu/Spice-Hub-Restaurant-App"**
4. Railway will automatically detect the backend Dockerfile

5. **Add PostgreSQL Database:**
   - In your project, click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
   - Railway automatically links it to your backend

6. **Configure Backend Environment Variables:**
   Click on your backend service → **"Variables"** tab → Add these:
   
   ```
   SECRET_KEY=replace-with-long-random-string (example: https://djecrety.ir/)
   DEBUG=False
   DATABASE_ENGINE=postgresql
   DB_NAME=${{Postgres.PGDATABASE}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   ALLOWED_HOSTS=*.railway.app
   CORS_ALLOWED_ORIGINS=https://${{RAILWAY_PUBLIC_DOMAIN}}
   CSRF_TRUSTED_ORIGINS=https://${{RAILWAY_PUBLIC_DOMAIN}}
   ```

7. **Redeploy** backend after adding variables

Note: If the backend build fails with "requirements.txt not found", ensure the Dockerfile path is set to `backend/Dockerfile` and the build context is the repository root.

### 3. Create Admin User

1. Click on backend service → **"Settings"** → Scroll to **"Service"**
2. Find the deployed URL (something like: `spice-hub-backend-production-xxxx.up.railway.app`)
3. Go to the **"Deployments"** tab → Click latest deployment → **"View Logs"**
4. Click **"⌘ Shell"** button at the top
5. Run:
   ```bash
   python manage.py createsuperuser
   ```
   - Username: `admin`
   - Email: `admin@spicehub.com`
   - Password: (choose a secure password)

### 4. Deploy Frontend

**Option A: Nginx (Production-ready)**
1. In Railway project, click **"+ New"** → **"GitHub Repo"** → Select same repo again
2. Click **"Settings"**:
   - **Root Directory**: Leave empty (or `/`)
   - Under **"Deploy"** section:
     - **Dockerfile Path**: `frontend/Dockerfile`
3. **Add Environment Variable:**
   - Click **"Variables"** tab
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app/api`
   - Replace `your-backend-url` with actual backend URL from step 3.2

**Option B: Serve (Simpler)**
1. In Railway project, click **"+ New"** → **"GitHub Repo"** → Select same repo again
2. Click **"Settings"**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -l $PORT`
3. **Add Environment Variable:**
   - Click **"Variables"** tab
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app/api`

### 5. Update CORS Settings

Once frontend is deployed:
1. Copy frontend URL from Railway (e.g., `spice-hub-frontend-production-xxxx.up.railway.app`)
2. Go to backend service → **"Variables"** tab
3. Update these variables:
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend-url.railway.app
   CSRF_TRUSTED_ORIGINS=https://your-frontend-url.railway.app
   ALLOWED_HOSTS=*.railway.app,your-backend-url.railway.app
   ```
4. **Redeploy** backend

### 6. Rebuild Frontend with Correct Backend URL

1. Go to frontend service → **"Variables"** tab
2. Ensure `VITE_API_URL` points to your actual backend URL
3. Click **"Deployments"** → Click **"⋮"** on latest → **"Redeploy"**

---

## 🎉 Your App is Live!

**Frontend URL (Share with client):**
```
https://your-frontend-url.railway.app
```

**Admin Panel (For you):**
```
https://your-backend-url.railway.app/admin
```

---

## Test Everything

Visit your frontend URL and test:
- ✅ Home page loads
- ✅ Menu displays items
- ✅ Login/Register works
- ✅ Add items to cart
- ✅ Submit feedback
- ✅ Make reservations
- ✅ Admin panel accessible

---

## Alternative: One-Click Deploy

### Render.com (Free Tier Available)

**Backend:**
1. Go to https://render.com → **"New +"** → **"Web Service"**
2. Connect GitHub → Select repository
3. Configure:
   - Name: `spicehub-backend`
   - Environment: **Docker**
   - Dockerfile Path: `backend/Dockerfile`
   - Plan: **Free**
4. Add **PostgreSQL** database from Render dashboard
5. Add environment variables (similar to Railway)
6. Click **"Create Web Service"**

**Frontend:**
1. **"New +"** → **"Static Site"**
2. Configure:
   - Name: `spicehub-frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
3. Add environment variable: `VITE_API_URL`
4. Click **"Create Static Site"**

---

## Troubleshooting

**CORS Errors:**
- Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Must include `https://` and NO trailing slash

**Database Errors:**
- Check all `DB_*` environment variables
- Ensure PostgreSQL service is running
- Run migrations via shell: `python manage.py migrate`

**Static Files Not Loading:**
- Check logs for collectstatic errors
- Ensure whitenoise is in middleware

**Build Failures:**
- Check deployment logs
- Verify all dependencies are in requirements.txt
- Ensure Dockerfile paths are correct

---

## 📧 Send to Client

Email template:

```
Hi [Client Name],

Your Spice Hub restaurant website is now live! 🎉

Website: https://your-frontend-url.railway.app

Features available:
✅ Browse menu and add items to cart
✅ Place orders
✅ Submit feedback
✅ Make table reservations
✅ Read blog posts
✅ Contact form

The admin panel is also set up for you to manage:
- Menu items and pricing
- Orders and reservations
- Customer feedback
- Blog content

Admin access (separate secure email):
URL: https://your-backend-url.railway.app/admin
Username: [provided separately]
Password: [provided separately]

Please test all features and let me know if you need any adjustments!

Best regards,
[Your Name]
```

---

## Support & Maintenance

- **Free Tier Limits:** Railway gives $5 free credit/month
- **Monitoring:** Check Railway dashboard for uptime
- **Logs:** Access via Railway dashboard → Deployments → View Logs
- **Database Backups:** Railway provides automatic backups

Need help? Check DEPLOYMENT.md for detailed documentation.
