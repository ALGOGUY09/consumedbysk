# 🚀 Deploy to Cloudflare Pages - Complete Guide

Deploy your entire Media Tracker (frontend + backend) to Cloudflare Pages in 5 minutes!

## 🌟 Why Cloudflare Pages?

**All-in-one solution:**
- ✅ **Frontend hosting** (unlimited bandwidth)
- ✅ **Backend API** (Pages Functions)
- ✅ **Database** (D1 SQLite)
- ✅ **Global edge network** (300+ cities)
- ✅ **100% free** (generous limits)
- ✅ **Auto-deploy** from GitHub
- ✅ **Custom domain** + Free SSL

**Everything in one place!**

## ⚡ Quick Deploy (5 Minutes)

### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This opens your browser to authenticate.

### Step 3: Create D1 Database

```bash
wrangler d1 create media-tracker-db
```

**Output:**
```
✅ Successfully created DB 'media-tracker-db'

[[d1_databases]]
binding = "DB"
database_name = "media-tracker-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Important:** Copy the `database_id`!

### Step 4: Update wrangler.toml

Edit `wrangler.toml` and add your database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "media-tracker-db"
database_id = "YOUR_DATABASE_ID_HERE"  # ← Paste here
```

### Step 5: Deploy to Cloudflare Pages

```bash
wrangler pages deploy . --project-name=media-tracker
```

**First time deployment:**
- Wrangler will ask to create the project
- Type `y` to confirm
- Wait 30 seconds for deployment

**Output:**
```
✨ Compiled Worker successfully
✨ Uploading...
✨ Deployment complete!

🌍 https://media-tracker.pages.dev
```

**Copy your Pages URL!**

### Step 6: Bind D1 Database to Pages

```bash
wrangler pages deployment create --project-name=media-tracker --branch=main --d1=media-tracker-db
```

Or use the Cloudflare Dashboard:
1. Go to Pages → media-tracker
2. Settings → Functions
3. D1 database bindings → Add binding
4. Variable name: `DB`
5. D1 database: `media-tracker-db`

### Step 7: Update config.js

Edit `config.js`:

```javascript
const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://media-tracker.pages.dev', // ← Your Pages URL
    
    STORAGE_MODE: 'backend',
    FALLBACK_TO_LOCAL: true,
    AUTO_SYNC_INTERVAL: 5 * 60 * 1000,
    DEBUG: false
};
```

### Step 8: Redeploy with Updated Config

```bash
git add config.js
git commit -m "feat: Connect to Cloudflare Pages backend"
git push origin main
wrangler pages deploy . --project-name=media-tracker
```

### Step 9: Test Your Deployment

Open your site:
```
https://media-tracker.pages.dev
```

Test the API:
```bash
# Get entries
curl https://media-tracker.pages.dev/api/entries

# Get stats
curl https://media-tracker.pages.dev/api/stats

# Login as admin
curl -X POST https://media-tracker.pages.dev/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"play123"}'
```

## 🎉 You're Live!

Your entire app is now on Cloudflare's global network!

### What You Have

✅ **Frontend**: Served from Cloudflare Pages
✅ **Backend API**: Running as Pages Functions
✅ **Database**: D1 SQLite (serverless)
✅ **Global Edge**: 300+ locations worldwide
✅ **Free Forever**: Generous limits

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│      Cloudflare Pages Deployment        │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │  Frontend (index.html, CSS, JS)   │ │
│  │  https://media-tracker.pages.dev  │ │
│  └─────────────┬──────────────────────┘ │
│                │                         │
│                ▼                         │
│  ┌────────────────────────────────────┐ │
│  │  Pages Functions (/functions)     │ │
│  │  /api/* → functions/api/[[path]].js│ │
│  └─────────────┬──────────────────────┘ │
│                │                         │
│                ▼                         │
│  ┌────────────────────────────────────┐ │
│  │  D1 Database (SQLite)              │ │
│  │  Replicated globally               │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Everything in one deployment!**

## 🔄 Auto-Deploy from GitHub

### Option 1: Connect GitHub (Recommended)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Pages → Create application
3. Connect to Git → Select your repo
4. Project name: `media-tracker`
5. Build settings:
   - Build command: (leave empty)
   - Build output directory: `.` or `/`
6. Add D1 binding:
   - Variable name: `DB`
   - D1 database: `media-tracker-db`
7. Save and Deploy!

**Now every push to GitHub auto-deploys!**

### Option 2: Manual Deploy (What we did above)

```bash
wrangler pages deploy . --project-name=media-tracker
```

## 💰 Free Tier Limits

**Pages:**
- ✅ 500 builds/month
- ✅ Unlimited requests
- ✅ Unlimited bandwidth
- ✅ 100 custom domains

**Functions:**
- ✅ 100,000 requests/day
- ✅ 10ms CPU time per request
- ✅ 128MB memory

**D1 Database:**
- ✅ 5GB storage
- ✅ 5 million reads/day
- ✅ 100,000 writes/day

**More than enough for thousands of users!**

## 🔧 Project Structure

```
webapp/
├── index.html              ← Frontend (auto-served)
├── config.js               ← Configuration
├── data-service.js         ← Data service
├── api-client.js           ← API client
├── functions/              ← Backend API
│   └── api/
│       └── [[path]].js     ← Handles /api/*
├── wrangler.toml           ← Cloudflare config
└── ... (other frontend files)
```

**Pages automatically:**
- Serves all files in root as static assets
- Routes `/api/*` to `functions/api/[[path]].js`
- Binds D1 database to `env.DB`

## 🐛 Troubleshooting

### "Database not found" Error

1. **Check binding in Dashboard:**
   - Pages → media-tracker → Settings → Functions
   - Verify D1 binding exists with name `DB`

2. **Add binding via CLI:**
   ```bash
   wrangler pages deployment create \
     --project-name=media-tracker \
     --branch=main \
     --d1=media-tracker-db
   ```

### "Function not found" Error

1. **Check function file exists:**
   ```bash
   ls -la functions/api/[[path]].js
   ```

2. **Redeploy:**
   ```bash
   wrangler pages deploy . --project-name=media-tracker
   ```

### CORS Errors

Functions have CORS configured. If you still have issues:
- Check browser console for specific error
- Verify request URL is correct
- Check API path matches function routes

### API Returns 404

**Verify your Pages Function path:**
- File: `functions/api/[[path]].js`
- Routes all: `/api/*`
- Example: `/api/entries` → handled
- Example: `/api/admin/login` → handled

## 📈 Performance

**Global Edge Network:**
- ⚡ <50ms response time
- 🌍 Served from nearest location
- ✅ No cold starts
- 🚀 Instant page loads

## 🔐 Security

**Built-in:**
- ✅ HTTPS everywhere (free SSL)
- ✅ DDoS protection
- ✅ Web Application Firewall (WAF)
- ✅ Password hashing (SHA-256)
- ✅ Session tokens with expiration
- ✅ CORS protection

## 📊 Monitor Your Deployment

**Cloudflare Dashboard:**
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Pages → media-tracker
3. View:
   - Requests/second
   - Bandwidth usage
   - Error rates
   - Geographic distribution

**View Logs:**
```bash
wrangler pages deployment tail --project-name=media-tracker
```

## 🎨 Custom Domain (Optional)

1. **Add domain to Cloudflare:**
   - Dashboard → Add site
   - Enter your domain
   - Update nameservers

2. **Connect to Pages:**
   - Pages → media-tracker → Custom domains
   - Add domain: `yourdomain.com`
   - Cloudflare handles DNS + SSL automatically

3. **Update config.js:**
   ```javascript
   API_BASE_URL: 'https://yourdomain.com'
   ```

## 🔄 Update Your Deployment

**Method 1: Auto-deploy from GitHub**
```bash
git add .
git commit -m "Your changes"
git push origin main
# Cloudflare auto-deploys!
```

**Method 2: Manual deploy**
```bash
wrangler pages deploy . --project-name=media-tracker
```

## 🧪 Test Everything

**Frontend:**
```bash
curl https://media-tracker.pages.dev/
```

**API Endpoints:**
```bash
# Public endpoints
curl https://media-tracker.pages.dev/api/entries
curl https://media-tracker.pages.dev/api/stats

# Admin login
curl -X POST https://media-tracker.pages.dev/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"play123"}'

# Create entry (use token from login)
curl -X POST https://media-tracker.pages.dev/api/admin/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Movie",
    "mediaType": "movie",
    "date": "2025-10-28",
    "rating": 5
  }'
```

## ✅ Success Checklist

- [ ] Wrangler CLI installed
- [ ] Logged in to Cloudflare
- [ ] D1 database created
- [ ] Database ID added to wrangler.toml
- [ ] Project deployed to Pages
- [ ] D1 binding configured
- [ ] config.js updated with Pages URL
- [ ] Changes committed and pushed
- [ ] Tested frontend loads
- [ ] Tested API endpoints
- [ ] Tested admin login
- [ ] Created test entry
- [ ] Verified cross-device sync

## 🎉 You're Done!

Your Media Tracker is now fully deployed on Cloudflare Pages!

**Benefits:**
- ✅ Frontend + Backend in one place
- ✅ Global edge network
- ✅ Always-on, no cold starts
- ✅ Auto-deploys from GitHub
- ✅ 100% free
- ✅ Access from anywhere

**URL:** `https://media-tracker.pages.dev`

Start using it from any device - your data syncs automatically! 🌍

---

**Need help?**
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Pages Functions Docs](https://developers.cloudflare.com/pages/platform/functions/)
- [D1 Docs](https://developers.cloudflare.com/d1/)
