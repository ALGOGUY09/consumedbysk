/**
 * Configuration for Media Tracker
 * This file contains environment-specific settings
 */

const CONFIG = {
    // Backend API URL - Update after deploying to Cloudflare Workers
    // For local development: 'http://localhost:3000'
    // For Cloudflare Workers: 'https://media-tracker-api.YOUR_SUBDOMAIN.workers.dev'
    // For Render: 'https://your-app.onrender.com'
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://media-tracker-api.YOUR_SUBDOMAIN.workers.dev', // 🔥 Update with YOUR Worker URL
    
    // Storage mode: 'backend' (recommended for cross-platform) or 'local' (IndexedDB only)
    STORAGE_MODE: 'backend',
    
    // Fallback to local storage if backend is unavailable
    FALLBACK_TO_LOCAL: true,
    
    // Auto-sync interval (milliseconds) - sync every 5 minutes
    AUTO_SYNC_INTERVAL: 5 * 60 * 1000,
    
    // Enable debug logging
    DEBUG: false
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
