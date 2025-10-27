# Media Tracker - PWA with Material 3 Design

A Progressive Web App (PWA) for tracking movies, TV shows, books, podcasts, games, and music with Google's Material 3 design system in a beautiful blue theme.

## ✨ Features

- 🎬 **Multi-Media Tracking**: Track movies, TV shows, books, podcasts, games, and music
- 📱 **Progressive Web App**: Install on any device, works offline
- 🎨 **Material 3 Design**: Modern, beautiful UI with blue color scheme
- 💾 **Offline-First**: All data stored locally using IndexedDB
- 📊 **Statistics**: View your consumption patterns and stats
- ⭐ **Rating System**: Rate your media from 1-5 stars
- 🔍 **Search**: Quickly find entries by title or notes
- 📅 **Date Filtering**: View entries by date, month, or see all
- 🌐 **No Backend Required**: Completely client-side, no server needed

## 🚀 Technologies

- Pure HTML5, CSS3, and JavaScript (ES6+)
- IndexedDB for local storage
- Service Workers for offline functionality
- Web App Manifest for PWA capabilities
- Material Design 3 color system
- Google Fonts (Roboto) and Material Symbols

## 📱 Installation

### As a PWA (Recommended)
1. Open the website in a modern browser (Chrome, Edge, Safari, Firefox)
2. Click the install button in your browser's address bar
3. Or use the browser menu: "Install app" or "Add to Home Screen"
4. The app will work offline once installed!

### Local Development
Simply open `index.html` in any modern web browser. No build process required!

## 🎯 How to Use

### Adding Entries
1. Click the **"Add Entry"** button in the header
2. Fill in the details:
   - **Title**: Name of the media
   - **Type**: Movie, TV Show, Book, Podcast, Game, or Music
   - **Creator/Author**: (Optional) Director, author, artist, etc.
   - **Rating**: (Optional) Rate from 1-5 stars
   - **URL**: (Optional) Link to IMDb, Goodreads, etc.
   - **Date**: When you consumed it
   - **Notes**: (Optional) Your thoughts and comments
3. Click **"Save"**

### Viewing Entries
- **All Entries**: Default view showing all your tracked media
- **Today**: Filter to see only today's entries
- **Statistics**: View comprehensive stats about your consumption

### Filtering by Date
Click the calendar dropdown in the header to:
- View all dates
- See today's entries
- Browse by month and specific dates

### Editing/Deleting
Click any entry card to edit or delete it.

## 💾 Data Storage

All data is stored locally in your browser using IndexedDB:
- **Database**: `MediaTracker`
- **Store**: `entries`
- No cloud sync or external services
- Data persists between sessions
- Survives browser restarts

## 🎨 Material 3 Blue Theme

The app uses Material Design 3 with a custom blue color palette:
- **Primary**: `#1E88E5` (Blue 600)
- **Secondary**: `#42A5F5` (Blue 400)
- **Surface**: `#F5F9FD` (Light Blue Tint)
- **Background**: `#FAFCFF` (Almost White)
- Modern elevation system with shadows
- Smooth transitions and animations
- Responsive design for all screen sizes

## 📊 Features in Detail

### Media Types
- 🎬 **Movies**: Track films you've watched
- 📺 **TV Shows**: Log series and episodes
- 📚 **Books**: Record books you've read
- 🎙️ **Podcasts**: Track podcast episodes
- 🎮 **Games**: Log games you've played
- 🎵 **Music**: Track albums or songs

### Statistics Dashboard
- Total entries tracked
- Entries this month/year
- Breakdown by media type
- Visual stat cards with counts

### Search & Filter
- Real-time search by title or notes
- Date-based filtering
- Month grouping in date picker
- Entry counts per date

## 🔒 Privacy

- **100% Private**: All data stays on your device
- **No Tracking**: No analytics or tracking scripts
- **No Account Required**: No login or registration
- **No Cloud**: Data never leaves your browser

## 🌐 Browser Support

- ✅ Chrome/Edge (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Opera (v76+)
- 📱 All modern mobile browsers

## 🛠 Deployment

### Static Hosting
Deploy to any static hosting service:

1. **Cloudflare Pages**:
   - Connect your Git repo
   - Build command: (none needed)
   - Build output directory: `/`
   - Deploy!

2. **Netlify**:
   - Drag and drop the entire folder
   - Or connect Git repo
   - No build configuration needed

3. **GitHub Pages**:
   - Push to GitHub
   - Enable Pages in Settings
   - Select branch and root directory

4. **Vercel**:
   - Import project
   - Zero configuration needed
   - Deploy!

### Files to Deploy
```
index.html          - Main app file
manifest.json       - PWA manifest
sw.js              - Service worker
icon-192.png       - App icon (192x192)
icon-512.png       - App icon (512x512)
```

## 🔄 Offline Support

The app works completely offline:
- Service worker caches all assets
- IndexedDB stores all entries
- Can add/edit/delete entries offline
- Data syncs when back online (future feature)

## 📝 Content Model

Each entry is stored as:
```javascript
{
  id: 1,                           // Auto-generated
  title: "The Matrix",             // Required
  mediaType: "movie",              // Required
  creator: "Wachowskis",          // Optional
  rating: "5",                     // Optional (1-5)
  url: "https://...",             // Optional
  date: "2025-10-27",             // Required
  notes: "Mind-blowing sci-fi",   // Optional
  createdAt: "2025-10-27T10:00"   // Auto-generated
}
```

## 🎯 Future Enhancements

Potential features for future versions:
- [ ] Export/Import data (JSON, CSV)
- [ ] Backup to cloud storage (optional)
- [ ] Dark mode toggle
- [ ] Custom themes
- [ ] Tags and categories
- [ ] Cover art/images
- [ ] Statistics charts and graphs
- [ ] Multi-device sync (optional)
- [ ] Social sharing

## 🤝 Contributing

This is a standalone PWA project. Feel free to:
- Fork and customize for your needs
- Add new features
- Improve the design
- Report bugs or suggest features

## 📄 License

Free to use and modify for personal or commercial projects.

## 🙏 Credits

- **Design System**: Material Design 3 by Google
- **Icons**: Material Symbols (Google Fonts)
- **Font**: Roboto (Google Fonts)

---

**Enjoy tracking your media consumption!** 🎬📚🎮🎵
