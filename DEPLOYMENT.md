# 🚀 Deployment Guide

Complete guide to deploy Media Tracker to GitHub Pages and Cloudflare Pages.

---

## 📋 Table of Contents

- [GitHub Pages Deployment](#github-pages-deployment)
- [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
- [Custom Domain Setup](#custom-domain-setup)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

---

## 🐙 GitHub Pages Deployment

### Method 1: Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the `main` branch.

#### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

#### Step 2: Push to Main Branch

```bash
# Merge your changes to main
git checkout main
git merge genspark_ai_developer
git push origin main
```

The GitHub Actions workflow will automatically:
- Build and deploy your site
- Your site will be available at: `https://[username].github.io/[repo-name]/`

#### Step 3: Verify Deployment

1. Go to the **Actions** tab in your repository
2. Check that the deployment workflow succeeded
3. Visit your GitHub Pages URL

### Method 2: Manual Deployment

If you prefer manual deployment:

1. Go to **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select branch: `main` or `genspark_ai_developer`
4. Select folder: `/ (root)`
5. Click **Save**

---

## ☁️ Cloudflare Pages Deployment

### Prerequisites

- Cloudflare account (free tier works!)
- Your repository on GitHub

### Step 1: Connect Repository

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Pages** in the sidebar
3. Click **Create a project**
4. Click **Connect to Git**
5. Authorize Cloudflare to access your GitHub
6. Select your repository: `consumedbysk`

### Step 2: Configure Build Settings

**Build configuration:**
```
Build command: (leave empty)
Build output directory: /
Root directory: /
```

Since this is a static site with no build process, leave the build command empty.

### Step 3: Environment Variables (Optional)

For Firebase configuration (if using real Firebase):
```
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
```

### Step 4: Deploy

1. Click **Save and Deploy**
2. Cloudflare will deploy your site
3. Your site will be available at: `https://[project-name].pages.dev`

### Step 5: Custom Domain (Optional)

1. In Cloudflare Pages, go to **Custom domains**
2. Click **Set up a custom domain**
3. Add your domain (e.g., `mediatracker.yourdomain.com`)
4. Follow the DNS configuration instructions

---

## 🌐 Custom Domain Setup

### For GitHub Pages

1. **Create CNAME file**
   - Already created in the repository
   - Edit `CNAME` file with your domain:
     ```
     mediatracker.yourdomain.com
     ```

2. **Configure DNS**
   
   Add these DNS records to your domain:
   ```
   Type: CNAME
   Name: mediatracker (or @)
   Value: [username].github.io
   ```

3. **Enable HTTPS**
   - Go to **Settings** → **Pages**
   - Check **Enforce HTTPS**

### For Cloudflare Pages

1. **Add Custom Domain**
   - In Cloudflare Pages project settings
   - Click **Custom domains** → **Set up a custom domain**

2. **DNS Configuration**
   - If using Cloudflare DNS (recommended):
     - Automatic configuration
   - If using external DNS:
     ```
     Type: CNAME
     Name: mediatracker
     Value: [project-name].pages.dev
     ```

3. **SSL/TLS**
   - Automatically enabled by Cloudflare
   - Free SSL certificate included

---

## ⚙️ Environment Configuration

### Firebase Setup (Optional)

If you want to use real Firebase for cloud sync:

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database

2. **Get Configuration**
   - Go to Project Settings
   - Copy your Firebase configuration
   - Replace the demo config in `index.html`:

   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
   };
   ```

3. **Configure Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /entries/{entry} {
         allow read, write: if true;
       }
     }
   }
   ```

### PWA Configuration

The app is already configured as a PWA with:
- ✅ `manifest.json` - App manifest
- ✅ `sw.js` - Service worker
- ✅ Icons in multiple sizes
- ✅ Offline support

No additional configuration needed!

---

## 🔧 Build Process

This project is a **zero-build static site**:
- ✅ No npm install required
- ✅ No build step needed
- ✅ Pure HTML/CSS/JavaScript
- ✅ Deploy directly from repository

Just push your code and it's deployed!

---

## 🐛 Troubleshooting

### GitHub Pages

**Issue: Site not updating**
- Solution: Clear browser cache or use incognito mode
- Check Actions tab for deployment status

**Issue: 404 errors**
- Solution: Make sure `index.html` is in the root directory
- Check that GitHub Pages is enabled

**Issue: Service worker not working**
- Solution: GitHub Pages requires HTTPS
- Make sure "Enforce HTTPS" is enabled

### Cloudflare Pages

**Issue: Build failed**
- Solution: Leave build command empty (it's a static site)
- Make sure build output directory is `/`

**Issue: Assets not loading**
- Solution: Check `_headers` file is properly formatted
- Verify all assets are in the repository

**Issue: PWA not installable**
- Solution: Check that `manifest.json` is accessible
- Verify HTTPS is enabled

### Firebase Sync Issues

**Issue: Sync not working**
- Solution: Check Firebase configuration
- Make sure Firestore is enabled
- Verify security rules allow read/write

**Issue: Admin login fails**
- Solution: Check password is correct: `play123`
- Clear browser localStorage and try again

---

## 📊 Deployment Checklist

Before deploying, ensure:

- [x] All files committed to git
- [x] Icons (192x192, 512x512) are present
- [x] `manifest.json` is configured
- [x] `sw.js` is in root directory
- [x] `.nojekyll` file exists (for GitHub Pages)
- [x] `_headers` and `_redirects` exist (for Cloudflare)
- [x] Firebase config updated (if using real Firebase)
- [x] Tested locally
- [x] PWA features work offline

---

## 🎯 Post-Deployment

After successful deployment:

1. **Test the Live Site**
   - Visit your deployed URL
   - Add some entries
   - Test offline functionality
   - Try PWA installation
   - Test cloud sync (if configured)

2. **Monitor Performance**
   - Use Lighthouse in Chrome DevTools
   - Check PWA score
   - Verify performance metrics

3. **Share Your App**
   - Your app is now live!
   - Share the URL with others
   - Consider adding to app stores

---

## 🔗 Quick Links

### GitHub Pages
- **Dashboard**: https://github.com/[username]/[repo]/settings/pages
- **Actions**: https://github.com/[username]/[repo]/actions
- **URL**: https://[username].github.io/[repo-name]/

### Cloudflare Pages
- **Dashboard**: https://dash.cloudflare.com/pages
- **URL**: https://[project-name].pages.dev

---

## 📱 Mobile App Stores (Future)

To publish as a native app:

### iOS (App Store)
- Use PWABuilder or Capacitor
- Apple Developer Account required ($99/year)

### Android (Play Store)
- Use Trusted Web Activities (TWA)
- Google Play Developer Account ($25 one-time)

---

## 💡 Tips

1. **Use Cloudflare Pages** for best performance
   - Free CDN worldwide
   - Automatic HTTPS
   - Fast deployment
   - No build process needed

2. **Enable Analytics**
   - GitHub Pages: Use Google Analytics
   - Cloudflare: Built-in Web Analytics

3. **Custom Domain**
   - More professional
   - Better for sharing
   - Improves SEO

4. **Regular Updates**
   - Push to main branch
   - Auto-deploys with GitHub Actions
   - Or triggers Cloudflare rebuild

---

## 🎉 Success!

Your Media Tracker is now deployed and accessible worldwide!

**Next steps:**
- Add entries and test features
- Share with friends and family
- Customize for your needs
- Enjoy tracking your media! 🎬📚🎮🎵

---

**Need help?** Check the main README.md or open an issue on GitHub.
