# 🚀 Quick Deploy to Render.com

Deploy your Media Tracker backend in 5 minutes for FREE cross-platform sync!

## ⚡ Quick Start (5 minutes)

### Step 1: Fork or Use Your Repo

You already have the repo: `ALGOGUY09/consumedbysk`

### Step 2: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click "Get Started"
3. Sign up with your GitHub account

### Step 3: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Click **"Connect account"** if needed
3. Find and select `ALGOGUY09/consumedbysk`
4. Click **"Connect"**

### Step 4: Configure Service

Fill in these settings:

**Basic Settings:**
- **Name**: `media-tracker-backend` (or anything you like)
- **Region**: Choose closest to you (US East recommended)
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

**Plan:**
- Select **"Free"** (0$/month)

### Step 5: Environment Variables

Scroll to **"Environment"** section and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |

### Step 6: Add Persistent Disk (CRITICAL!)

Scroll to **"Disk"** section:

1. Click **"Add Disk"**
2. **Name**: `media-tracker-data`
3. **Mount Path**: `/opt/render/project/src`
4. **Size**: 1 GB (free tier max)

⚠️ **Important**: Without disk, your database will be deleted on every deploy!

### Step 7: Deploy!

1. Click **"Create Web Service"** at the bottom
2. Wait 2-3 minutes for first deployment
3. Watch the logs - you'll see:
   ```
   Server running on http://0.0.0.0:10000
   Connected to SQLite database
   Admin settings initialized
   ```

### Step 8: Get Your Backend URL

After deployment completes:
1. Your URL will be shown at the top: `https://media-tracker-backend-xxxx.onrender.com`
2. Copy this URL!

### Step 9: Update Your Frontend

Update `config.js` in your repo:

```javascript
const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://media-tracker-backend-xxxx.onrender.com', // ← YOUR URL HERE
    
    STORAGE_MODE: 'backend',
    FALLBACK_TO_LOCAL: true,
    AUTO_SYNC_INTERVAL: 5 * 60 * 1000,
    DEBUG: false
};
```

### Step 10: Commit and Push

```bash
git add config.js
git commit -m "feat: Connect to Render backend for cross-platform sync"
git push origin main
```

### Step 11: Test Your Backend

Open your Render URL in browser:
- `https://your-app.onrender.com/api/entries` → Should show `{"entries":[]}`

Or use curl:
```bash
curl https://your-app.onrender.com/api/entries
curl https://your-app.onrender.com/api/stats
```

## 🎉 You're Live!

Your backend is now deployed! Here's what you have:

✅ **24/7 Cloud Backend** - Running on Render's servers
✅ **Persistent SQLite Database** - Data survives deployments  
✅ **REST API** - Accessible from anywhere
✅ **Cross-Platform Sync** - Access from any device
✅ **Free Hosting** - $0/month forever

## 🔄 How Sync Works

1. **Open app** → Fetches latest data from cloud
2. **Add/Edit entry** → Instantly saved to cloud
3. **Offline changes** → Queued locally
4. **Back online** → Auto-syncs queued changes
5. **Other devices** → See updates immediately

## ⚠️ Important Notes

### Free Tier Limitations

**Render Free Tier:**
- ✅ 750 hours/month (enough for 1 service 24/7)
- ✅ 1GB persistent disk
- ✅ Shared CPU/RAM
- ⚠️ **Spins down after 15 minutes of inactivity**
- ⚠️ **First request after sleep takes 30-60 seconds**

**Workarounds for Spin-Down:**
- Use a service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 10 minutes
- Or upgrade to paid tier ($7/month) for always-on

### Database Backups

Your database is in `/opt/render/project/src/media_tracker.db`

**To backup:**
1. Use the admin panel → "Download Backup"
2. Or connect via Render Shell and download the .db file

### Updating Your Backend

When you push to GitHub:
1. Render auto-detects changes
2. Automatically rebuilds and redeploys
3. Your disk data persists!

## 🐛 Troubleshooting

### "Service Unavailable"
- First request after sleep - wait 30-60 seconds
- Check Render logs for errors
- Verify environment variables

### "Database not found"
- Ensure disk is mounted at `/opt/render/project/src`
- Check disk is not full (1GB limit)
- Review deploy logs for disk mount errors

### CORS Errors
- Your backend already has CORS configured
- Add your GitHub Pages URL to whitelist if needed
- Check browser console for specific error

### Data Not Syncing
- Check browser console for API errors
- Verify backend URL in config.js
- Test API endpoint directly
- Check Render logs

## 📊 Monitoring

**View Logs:**
Dashboard → Your Service → Logs tab

**Check Status:**
Dashboard → Your Service → Events tab

**Resource Usage:**
Dashboard → Disk → See storage used

## 🔒 Security Tips

1. **Change Admin Password**:
   - After first deploy, update the password
   - Don't use default `play123` in production

2. **Environment Variables**:
   - Never commit passwords to Git
   - Use Render's environment variable feature

3. **HTTPS Only**:
   - Render provides free SSL
   - Never use HTTP for production

## 💰 Upgrade Options

If you need more:

**Render Paid Tier ($7/month):**
- Always-on (no spin-down)
- More CPU/RAM
- Faster performance
- Priority support

**Better Alternatives:**
- **Railway**: $5 credit/month, better performance
- **Fly.io**: 3 free VMs, always-on
- **Cloudflare Workers**: Unlimited scale, serverless

## 🎯 Success Checklist

- [ ] Render account created
- [ ] Web service deployed
- [ ] Persistent disk added (1GB)
- [ ] Environment variables set
- [ ] Backend URL copied
- [ ] config.js updated with backend URL
- [ ] Changes committed and pushed
- [ ] Tested API endpoints
- [ ] Logged in from frontend
- [ ] Created test entry
- [ ] Verified cross-device sync

## 🌟 Next Steps

1. **Test from multiple devices**
   - Phone, tablet, laptop
   - All should show same data!

2. **Set up monitoring** (optional)
   - [UptimeRobot](https://uptimerobot.com) for keep-alive pings
   - Get alerts if backend goes down

3. **Backup your data**
   - Use admin panel regularly
   - Download JSON backups

4. **Customize admin password**
   - Update from default
   - Keep it secure!

## 🆘 Need Help?

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Check Logs**: Dashboard → Logs
- **Test API**: Use curl or Postman
- **Browser Console**: Check for errors

---

**Congratulations! Your Media Tracker now syncs across all your devices!** 🎉

Access your data from anywhere - phone, tablet, laptop, anywhere with internet!
