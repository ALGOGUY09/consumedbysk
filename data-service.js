/**
 * Unified Data Service for Media Tracker
 * Handles both backend API and local IndexedDB storage
 * Provides cross-platform sync capabilities
 */

class DataService {
    constructor(config) {
        this.config = config;
        this.api = null;
        this.localDB = null;
        this.isOnline = navigator.onLine;
        this.syncQueue = [];
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processSyncQueue();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    // Initialize the data service
    async init(apiBaseUrl) {
        console.log('Initializing Data Service...');
        
        // Initialize API client
        this.api = new MediaTrackerAPI(apiBaseUrl);
        
        // Initialize local IndexedDB as fallback
        if (this.config.FALLBACK_TO_LOCAL) {
            await this.initLocalDB();
        }
        
        console.log('Data Service initialized');
        console.log('Storage mode:', this.config.STORAGE_MODE);
        console.log('Online:', this.isOnline);
    }

    // Initialize local IndexedDB
    async initLocalDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('MediaTracker', 2);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.localDB = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('entries')) {
                    const store = db.createObjectStore('entries', { keyPath: 'id', autoIncrement: true });
                    store.createIndex('date', 'date', { unique: false });
                    store.createIndex('mediaType', 'mediaType', { unique: false });
                }
            };
        });
    }

    // Get all entries
    async getAll() {
        if (this.config.STORAGE_MODE === 'backend' && this.isOnline) {
            try {
                const result = await this.api.getEntries();
                if (result.success) {
                    // Update local cache
                    if (this.config.FALLBACK_TO_LOCAL) {
                        await this.updateLocalCache(result.entries);
                    }
                    return result.entries;
                }
            } catch (error) {
                console.error('Backend fetch failed:', error);
            }
        }
        
        // Fallback to local storage
        if (this.config.FALLBACK_TO_LOCAL && this.localDB) {
            return this.getLocalEntries();
        }
        
        return [];
    }

    // Get entries with filters
    async getEntries(filters = {}) {
        if (this.config.STORAGE_MODE === 'backend' && this.isOnline) {
            try {
                const result = await this.api.getEntries(filters);
                if (result.success) {
                    return result.entries;
                }
            } catch (error) {
                console.error('Backend fetch failed:', error);
            }
        }
        
        // Fallback to local with filtering
        if (this.config.FALLBACK_TO_LOCAL && this.localDB) {
            const entries = await this.getLocalEntries();
            return this.filterEntries(entries, filters);
        }
        
        return [];
    }

    // Get single entry by ID
    async get(id) {
        if (this.config.STORAGE_MODE === 'backend' && this.isOnline) {
            try {
                const result = await this.api.getEntries();
                if (result.success) {
                    return result.entries.find(e => e.id == id);
                }
            } catch (error) {
                console.error('Backend fetch failed:', error);
            }
        }
        
        // Fallback to local
        if (this.config.FALLBACK_TO_LOCAL && this.localDB) {
            return this.getLocalEntry(id);
        }
        
        return null;
    }

    // Add new entry
    async add(entry) {
        if (this.config.STORAGE_MODE === 'backend' && this.isOnline) {
            try {
                const result = await this.api.createEntry(entry);
                if (result.success) {
                    // Add to local cache
                    if (this.config.FALLBACK_TO_LOCAL) {
                        await this.addLocalEntry(result.entry);
                    }
                    return result.entry.id;
                }
            } catch (error) {
                console.error('Backend add failed:', error);
                // Add to sync queue
                this.syncQueue.push({ action: 'add', entry });
            }
        }
        
        // Fallback to local
        if (this.config.FALLBACK_TO_LOCAL && this.localDB) {
            const id = await this.addLocalEntry(entry);
            // Add to sync queue for later
            if (this.config.STORAGE_MODE === 'backend') {
                this.syncQueue.push({ action: 'add', entry: { ...entry, id } });
            }
            return id;
        }
        
        throw new Error('Unable to add entry');
    }

    // Update entry
    async update(id, entry) {
        if (this.config.STORAGE_MODE === 'backend' && this.isOnline) {
            try {
                const result = await this.api.updateEntry(id, entry);
                if (result.success) {
                    // Update local cache
                    if (this.config.FALLBACK_TO_LOCAL) {
                        await this.updateLocalEntry(id, entry);
                    }
                    return true;
                }
            } catch (error) {
                console.error('Backend update failed:', error);
                // Add to sync queue
                this.syncQueue.push({ action: 'update', id, entry });
            }
        }
        
        // Fallback to local
        if (this.config.FALLBACK_TO_LOCAL && this.localDB) {
            await this.updateLocalEntry(id, entry);
            // Add to sync queue for later
            if (this.config.STORAGE_MODE === 'backend') {
                this.syncQueue.push({ action: 'update', id, entry });
            }
            return true;
        }
        
        throw new Error('Unable to update entry');
    }

    // Delete entry
    async delete(id) {
        if (this.config.STORAGE_MODE === 'backend' && this.isOnline) {
            try {
                const result = await this.api.deleteEntry(id);
                if (result.success) {
                    // Delete from local cache
                    if (this.config.FALLBACK_TO_LOCAL) {
                        await this.deleteLocalEntry(id);
                    }
                    return true;
                }
            } catch (error) {
                console.error('Backend delete failed:', error);
                // Add to sync queue
                this.syncQueue.push({ action: 'delete', id });
            }
        }
        
        // Fallback to local
        if (this.config.FALLBACK_TO_LOCAL && this.localDB) {
            await this.deleteLocalEntry(id);
            // Add to sync queue for later
            if (this.config.STORAGE_MODE === 'backend') {
                this.syncQueue.push({ action: 'delete', id });
            }
            return true;
        }
        
        throw new Error('Unable to delete entry');
    }

    // Get statistics
    async getStats() {
        if (this.config.STORAGE_MODE === 'backend' && this.isOnline) {
            try {
                const result = await this.api.getStats();
                if (result.success) {
                    return result.stats;
                }
            } catch (error) {
                console.error('Backend stats fetch failed:', error);
            }
        }
        
        // Calculate from local data
        if (this.config.FALLBACK_TO_LOCAL && this.localDB) {
            const entries = await this.getLocalEntries();
            return this.calculateStats(entries);
        }
        
        return { total: 0, thisMonth: 0, thisYear: 0, byType: {} };
    }

    // Process sync queue when back online
    async processSyncQueue() {
        if (!this.isOnline || this.syncQueue.length === 0) return;
        
        console.log(`Processing ${this.syncQueue.length} queued operations...`);
        
        const queue = [...this.syncQueue];
        this.syncQueue = [];
        
        for (const operation of queue) {
            try {
                switch (operation.action) {
                    case 'add':
                        await this.api.createEntry(operation.entry);
                        break;
                    case 'update':
                        await this.api.updateEntry(operation.id, operation.entry);
                        break;
                    case 'delete':
                        await this.api.deleteEntry(operation.id);
                        break;
                }
            } catch (error) {
                console.error('Sync operation failed:', error);
                // Re-add to queue
                this.syncQueue.push(operation);
            }
        }
        
        console.log('Sync queue processed');
    }

    // Local IndexedDB operations
    getLocalEntries() {
        return new Promise((resolve, reject) => {
            const tx = this.localDB.transaction(['entries'], 'readonly');
            const store = tx.objectStore('entries');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    getLocalEntry(id) {
        return new Promise((resolve, reject) => {
            const tx = this.localDB.transaction(['entries'], 'readonly');
            const store = tx.objectStore('entries');
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    addLocalEntry(entry) {
        return new Promise((resolve, reject) => {
            const tx = this.localDB.transaction(['entries'], 'readwrite');
            const store = tx.objectStore('entries');
            const request = store.add(entry);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    updateLocalEntry(id, entry) {
        return new Promise((resolve, reject) => {
            const tx = this.localDB.transaction(['entries'], 'readwrite');
            const store = tx.objectStore('entries');
            const request = store.put({ ...entry, id });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    deleteLocalEntry(id) {
        return new Promise((resolve, reject) => {
            const tx = this.localDB.transaction(['entries'], 'readwrite');
            const store = tx.objectStore('entries');
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async updateLocalCache(entries) {
        if (!this.localDB) return;
        
        const tx = this.localDB.transaction(['entries'], 'readwrite');
        const store = tx.objectStore('entries');
        
        // Clear existing
        await new Promise(resolve => {
            const req = store.clear();
            req.onsuccess = () => resolve();
        });
        
        // Add all entries
        for (const entry of entries) {
            await new Promise(resolve => {
                const req = store.add(entry);
                req.onsuccess = () => resolve();
                req.onerror = () => resolve(); // Continue even if error
            });
        }
    }

    // Helper functions
    filterEntries(entries, filters) {
        let filtered = entries;
        
        if (filters.date) {
            filtered = filtered.filter(e => e.date === filters.date);
        }
        
        if (filters.month) {
            filtered = filtered.filter(e => e.date.startsWith(filters.month));
        }
        
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(e => 
                e.title.toLowerCase().includes(search) ||
                (e.notes && e.notes.toLowerCase().includes(search))
            );
        }
        
        return filtered;
    }

    calculateStats(entries) {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const currentYear = now.getFullYear().toString();
        
        const stats = {
            total: entries.length,
            thisMonth: 0,
            thisYear: 0,
            byType: {}
        };
        
        entries.forEach(entry => {
            if (entry.date.startsWith(currentMonth)) {
                stats.thisMonth++;
            }
            if (entry.date.startsWith(currentYear)) {
                stats.thisYear++;
            }
            stats.byType[entry.mediaType] = (stats.byType[entry.mediaType] || 0) + 1;
        });
        
        return stats;
    }

    // Admin authentication
    async login(password) {
        return await this.api.login(password);
    }

    async logout() {
        return await this.api.logout();
    }

    isAdmin() {
        return this.api && this.api.isAdmin;
    }
}

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataService;
}
