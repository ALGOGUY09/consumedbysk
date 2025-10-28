# Cloud Deployment Guide - Cross-Platform Sync

This guide will help you deploy the Media Tracker backend to the cloud for true cross-platform synchronization. Access your data from anywhere!

## 🌟 Why Cloud Backend?

**Benefits:**
- ✅ **Cross-Platform**: Access from any device, anywhere
- ✅ **Auto-Sync**: Real-time synchronization across all devices
- ✅ **Data Security**: Centralized backup, never lose data
- ✅ **Multi-Device**: Use on phone, tablet, laptop simultaneously
- ✅ **Offline Support**: Works offline, syncs when back online

## 🚀 Recommended: Deploy to Render.com (FREE)

Render.com offers the best free tier for Node.js apps with persistent SQLite storage.

### Step 1: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with your GitHub account

### Step 2: Create New Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `ALGOGUY09/consumedbysk`
3. Configure the service:
   - **Name**: `media-tracker-backend` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`

### Step 3: Add Environment Variables

In the "Environment" section, add:
- `NODE_ENV` = `production`
- `PORT` = `3000`

### Step 4: Enable Persistent Disk (IMPORTANT!)

1. Scroll to "Disk" section
2. Click "Add Disk"
3. **Name**: `media-tracker-data`
4. **Mount Path**: `/opt/render/project/src`
5. **Size**: 1 GB (free tier)

This ensures your SQLite database persists across deployments!

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait 2-3 minutes for deployment
3. Your backend will be live at: `https://your-app-name.onrender.com`

### Step 6: Update Frontend Configuration

After deployment, update your frontend to use the live backend:

1. Get your Render URL (e.g., `https://media-tracker-backend.onrender.com`)
2. Update `config.js`:
   ```javascript
   API_BASE_URL: window.location.hostname === 'localhost' 
       ? 'http://localhost:3000' 
       : 'https://your-app-name.onrender.com'
   ```

### Step 7: Enable CORS (if needed)

Your backend already has CORS configured. If you have issues, add your GitHub Pages URL to the CORS whitelist in `server.js`:

```javascript
app.use(cors({
    origin: ['https://algoguy09.github.io', 'http://localhost:3000'],
    credentials: true
}));
```

## 🔄 Alternative: Deploy to Railway.app

Railway is another excellent free option:

### Quick Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose `ALGOGUY09/consumedbysk`
5. Railway auto-detects Node.js
6. Add environment variable: `NODE_ENV=production`
7. Your backend is live!

Railway provides:
- Automatic HTTPS
- Custom domains (free)
- Persistent volumes
- Built-in logging

## 🌍 Alternative: Deploy to Fly.io

Fly.io offers global edge deployment:

### Deploy to Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. In your project directory:
   ```bash
   fly launch
   # Follow prompts
   # Choose region closest to you
   ```
4. Create volume for persistence:
   ```bash
   fly volumes create media_data --size 1
   ```
5. Deploy:
   ```bash
   fly deploy
   ```

Your backend is now at: `https://your-app.fly.dev`

## ☁️ Alternative: Cloudflare Workers + D1

For serverless approach with Cloudflare's network:

### Setup Cloudflare D1 (Serverless SQLite)

1. Install Wrangler: `npm install -g wrangler`
2. Login: `wrangler login`
3. Create D1 database:
   ```bash
   wrangler d1 create media-tracker-db
   ```
4. Update `wrangler.toml` with D1 binding
5. Deploy: `wrangler deploy`

**Note**: Requires converting Express server to Cloudflare Workers format.

## 🔒 Update Admin Password (Recommended)

After deployment, you should update the admin password:

1. Connect to your backend
2. Run the password update script (see BACKEND_SETUP.md)
3. Or use the API endpoint (requires current password)

## 🧪 Test Your Cloud Backend

After deployment, test these endpoints:

```bash
# Replace YOUR_BACKEND_URL with your actual URL

# Test public endpoint
curl https://YOUR_BACKEND_URL/api/entries

# Test admin login
curl -X POST https://YOUR_BACKEND_URL/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"play123"}'

# Test stats
curl https://YOUR_BACKEND_URL/api/stats
```

## 📱 Update Frontend to Use Cloud Backend

### Method 1: Automatic (Recommended)

The frontend automatically detects the environment:
- Local: Uses `http://localhost:3000`
- Production: Uses the URL you set in `config.js`

### Method 2: Environment-Specific Build

Create different config files:
- `config.dev.js` - For local development
- `config.prod.js` - For production

Load the appropriate one based on environment.

## 🔄 How Auto-Sync Works

1. **Create/Update/Delete** → Instantly saved to cloud backend
2. **Offline Changes** → Queued locally in IndexedDB
3. **Back Online** → Automatically syncs queued changes
4. **Multiple Devices** → All devices fetch latest data on load
5. **Conflict Resolution** → Last write wins (server timestamp)

## 📊 Monitoring Your Backend

### Render.com
- View logs: Dashboard → Your Service → Logs
- Check health: Dashboard → Your Service → Events
- Database size: Dashboard → Disk → Usage

### Railway.app
- Metrics: Project → Metrics tab
- Logs: Project → Deployments → View Logs
- Resource usage: Project → Usage

### Fly.io
- Logs: `fly logs`
- Status: `fly status`
- Metrics: `fly dashboard`

## 🆘 Troubleshooting

### Backend not responding
1. Check deployment logs for errors
2. Verify environment variables are set
3. Ensure disk/volume is mounted correctly
4. Check if free tier is active (not sleeping)

### CORS errors
1. Add your frontend URL to CORS whitelist
2. Ensure credentials are included in requests
3. Check browser console for specific error

### Data not syncing
1. Check browser console for API errors
2. Verify backend URL in config.js
3. Test API endpoints directly with curl
4. Check network tab in DevTools

### Database lost after redeploy
1. Ensure persistent disk/volume is configured
2. Verify mount path matches server.js path
3. Check disk is not full

## 💰 Cost Comparison

| Platform | Free Tier | Storage | Bandwidth | Always On |
|----------|-----------|---------|-----------|-----------|
| **Render** | ✅ 750hrs/mo | 1GB SSD | 100GB | ❌ Sleeps after 15min |
| **Railway** | ✅ $5 credit | Unlimited | 100GB | ✅ Yes |
| **Fly.io** | ✅ 3 VMs | 3GB | 160GB | ✅ Yes |
| **Cloudflare** | ✅ Unlimited | 5GB D1 | Unlimited | ✅ Yes |

**Recommendation**: 
- **Start with Render** - Easiest setup, good for testing
- **Scale to Railway or Fly.io** - Better for production
- **Advanced users**: Cloudflare Workers for global edge network

## 🔐 Security Best Practices

1. **Change Admin Password**: Update from default `play123`
2. **Use HTTPS**: All platforms provide free SSL
3. **Environment Variables**: Never commit passwords to Git
4. **Rate Limiting**: Consider adding rate limits for API
5. **Backup Database**: Export data regularly from admin panel

## 🎉 Success!

After deployment, you'll have:
- ✅ Backend running 24/7 in the cloud
- ✅ SQLite database with persistent storage
- ✅ REST API accessible from anywhere
- ✅ Auto-sync across all devices
- ✅ Offline support with sync queue
- ✅ Free hosting (with limitations)

**Your Data is Now Available Everywhere!** 🌍

Open your GitHub Pages site from any device, login as admin, and your entries sync automatically!

## 📚 Next Steps

1. Deploy backend to Render (5 minutes)
2. Update config.js with your backend URL
3. Commit and push to GitHub
4. Test from multiple devices
5. Enjoy cross-platform sync!

Need help? Check the logs, test API endpoints, or review BACKEND_SETUP.md for detailed API documentation.
