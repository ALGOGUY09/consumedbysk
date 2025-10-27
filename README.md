# Media Tracker - PWA with Apple-Inspired Design

A Progressive Web App (PWA) for tracking movies, TV shows, books, podcasts, games, and music with beautiful Apple-inspired design aesthetics featuring glassmorphism, blur effects, and smooth animations.

## ✨ Features

- 🎬 **Multi-Media Tracking**: Track movies, TV shows, books, podcasts, games, and music
- 📱 **Progressive Web App**: Install on any device, works offline
- 🎨 **Apple-Inspired Design**: Glassmorphism, blur effects, and smooth animations
- 💾 **Offline-First**: All data stored locally using IndexedDB
- 📊 **Statistics**: View your consumption patterns with gradient numbers
- ⭐ **Rating System**: Rate your media from 1-5 stars
- 🔍 **Search**: Quickly find entries with beautiful focus animations
- 📅 **Date Filtering**: View entries by date, month, or see all
- 🌐 **No Backend Required**: Completely client-side, no server needed
- ✨ **Beautiful Animations**: Smooth transitions with Apple's timing curves

## 🚀 Technologies

- Pure HTML5, CSS3, and JavaScript (ES6+)
- IndexedDB for local storage
- Service Workers for offline functionality
- Web App Manifest for PWA capabilities
- Apple-inspired design system with glassmorphism
- Backdrop filters and blur effects (-webkit-backdrop-filter)
- Inter font (SF Pro alternative) and Material Symbols
- Smooth cubic-bezier animations: (0.25, 0.46, 0.45, 0.94)

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
3. Click **"SAVE"**

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

## 🎨 Apple-Inspired Design System

The app uses Apple's design language with modern effects:

### Color Palette
- **Apple Blue**: `#007AFF` (iOS system blue)
- **Apple Purple**: `#5856D6`
- **Apple Pink**: `#FF2D55`
- **Apple Orange**: `#FF9500`
- **Background**: `#F5F5F7` (Apple's light gray)
- **Surface**: `rgba(255, 255, 255, 0.8)` with backdrop blur
- **Glassmorphism**: Frosted glass effects throughout

### Typography
- **Font**: Inter (SF Pro alternative) with system font fallbacks
- **Letter Spacing**: -0.02em for headlines, -0.01em for body
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Line Height**: 1.47059 (Apple's golden ratio)
- **Smoothing**: -webkit-font-smoothing: antialiased

### Animations
- **Timing Function**: cubic-bezier(0.25, 0.46, 0.45, 0.94) (Apple's spring curve)
- **Duration**: 0.3s - 0.4s for most transitions
- **Hover States**: Smooth transform with translateY
- **Modal Animations**: Slide-up with opacity fade
- **Toast Notifications**: Blur background with slide-up

### Shadows
- **Light**: `0 1px 3px rgba(0,0,0,0.04)` - Subtle depth
- **Medium**: `0 4px 16px rgba(0,0,0,0.08)` - Card hover
- **Large**: `0 8px 32px rgba(0,0,0,0.12)` - Elevated elements
- **Extra Large**: `0 20px 60px rgba(0,0,0,0.15)` - Modals

### Border Radius
- **Small**: 8px
- **Medium**: 12px
- **Large**: 16px
- **Extra Large**: 20px
- **2XL**: 24px

## 📊 Features in Detail

### Media Types (with Beautiful Gradients)
- 🎬 **Movies**: Red to orange gradient `linear-gradient(135deg, #FF3B30, #FF9500)`
- 📺 **TV Shows**: Blue to light blue `linear-gradient(135deg, #007AFF, #5AC8FA)`
- 📚 **Books**: Orange to yellow `linear-gradient(135deg, #FF9500, #FFCC00)`
- 🎙️ **Podcasts**: Purple to pink `linear-gradient(135deg, #AF52DE, #FF2D55)`
- 🎮 **Games**: Indigo to purple `linear-gradient(135deg, #5856D6, #AF52DE)`
- 🎵 **Music**: Pink to red `linear-gradient(135deg, #FF2D55, #FF3B30)`

### Statistics Dashboard
- Total entries tracked with gradient text
- Entries this month/year
- Breakdown by media type
- Visual stat cards with hover animations
- Gradient numbers using `-webkit-background-clip: text`

### Search & Filter
- Real-time search by title or notes
- Focus animations with blue glow
- Date-based filtering with blur menu
- Month grouping in date picker
- Entry counts per date

## 🔒 Privacy

- **100% Private**: All data stays on your device
- **No Tracking**: No analytics or tracking scripts
- **No Account Required**: No login or registration
- **No Cloud**: Data never leaves your browser

## 🌐 Browser Support

- ✅ Chrome/Edge (v90+) - Full support with blur effects
- ✅ Firefox (v88+) - Full support
- ✅ Safari (v14+) - Perfect for Apple design with native blur
- ✅ Opera (v76+) - Full support
- 📱 All modern mobile browsers - Optimized for touch

## 🛠 Deployment

### Static Hosting
Deploy to any static hosting service:

1. **Cloudflare Pages** (recommended):
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
index.html          - Main app file (Apple design)
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
- Blur effects work offline
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

## 🎨 Design Highlights

### Glassmorphism
- **Header**: Frosted glass with `backdrop-filter: blur(20px) saturate(180%)`
- **Modals**: Translucent backgrounds with blur
- **Menus**: Elevated surfaces with blur effects
- **Toast**: Glass notification with blur background

### Card Design
- White backgrounds with subtle borders
- Hover: Elevated with shadow and transform
- Smooth transitions on all interactions
- Gradient icons for media types

### Form Elements
- Filled inputs with subtle backgrounds
- Focus: Blue border with glow effect
- Rounded corners (12px)
- Smooth animations

### Navigation
- Subtle tab design
- Active state with background
- Smooth color transitions

## 🎯 Future Enhancements

Potential features for future versions:
- [ ] Export/Import data (JSON, CSV)
- [ ] Backup to cloud storage (optional)
- [ ] Dark mode toggle (Apple style)
- [ ] Custom themes
- [ ] Tags and categories
- [ ] Cover art/images
- [ ] Statistics charts and graphs
- [ ] Multi-device sync (optional)
- [ ] Social sharing
- [ ] Siri shortcuts integration
- [ ] Widget support

## 🤝 Contributing

This is a standalone PWA project. Feel free to:
- Fork and customize for your needs
- Add new features
- Improve the design
- Report bugs or suggest features
- Share your feedback

## 📄 License

Free to use and modify for personal or commercial projects.

## 🙏 Credits

- **Design Inspiration**: Apple Inc. design language
- **Icons**: Material Symbols (Google Fonts)
- **Font**: Inter (Rasmus Andersson) - SF Pro alternative
- **Blur Effects**: CSS backdrop-filter

## 🌟 Acknowledgments

Special thanks to:
- Apple for inspiring beautiful, minimalist design
- The web community for glassmorphism techniques
- Modern browsers for supporting backdrop-filter

---

**Enjoy tracking your media consumption with beautiful Apple-inspired design!** 🎬📚🎮🎵
