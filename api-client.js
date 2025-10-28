/**
 * API Client for Media Tracker Backend
 * Handles communication between frontend and Node.js/SQLite backend
 */

class MediaTrackerAPI {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('admin_token');
        this.isAdmin = false;
        this.checkAdminStatus();
    }

    // ===== Authentication Methods =====

    async checkAdminStatus() {
        if (!this.token) {
            this.isAdmin = false;
            return false;
        }

        try {
            const response = await fetch(`${this.baseUrl}/api/admin/verify`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });

            if (response.ok) {
                this.isAdmin = true;
                return true;
            } else {
                this.logout();
                return false;
            }
        } catch (error) {
            console.error('Error verifying admin status:', error);
            this.isAdmin = false;
            return false;
        }
    }

    async login(password) {
        try {
            const response = await fetch(`${this.baseUrl}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                this.token = data.token;
                this.isAdmin = true;
                localStorage.setItem('admin_token', data.token);
                localStorage.setItem('admin_session', 'true');
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Invalid password' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Connection error' };
        }
    }

    async logout() {
        if (this.token) {
            try {
                await fetch(`${this.baseUrl}/api/admin/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${this.token}` }
                });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        this.token = null;
        this.isAdmin = false;
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_session');
    }

    // ===== Public Read-Only Methods =====

    async getEntries(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.date) params.append('date', filters.date);
            if (filters.month) params.append('month', filters.month);
            if (filters.search) params.append('search', filters.search);

            const response = await fetch(`${this.baseUrl}/api/entries?${params}`);
            const data = await response.json();

            if (response.ok) {
                return { success: true, entries: data.entries };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error fetching entries:', error);
            return { success: false, error: 'Connection error' };
        }
    }

    async getStats() {
        try {
            const response = await fetch(`${this.baseUrl}/api/stats`);
            const data = await response.json();

            if (response.ok) {
                return { success: true, stats: data };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            return { success: false, error: 'Connection error' };
        }
    }

    async getDates() {
        try {
            const response = await fetch(`${this.baseUrl}/api/dates`);
            const data = await response.json();

            if (response.ok) {
                return { success: true, dates: data.dates };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error fetching dates:', error);
            return { success: false, error: 'Connection error' };
        }
    }

    // ===== Admin-Only Methods =====

    async createEntry(entry) {
        if (!this.isAdmin) {
            return { success: false, error: 'Admin access required' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/api/admin/entries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(entry)
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, entry: data.entry };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error creating entry:', error);
            return { success: false, error: 'Connection error' };
        }
    }

    async updateEntry(id, entry) {
        if (!this.isAdmin) {
            return { success: false, error: 'Admin access required' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/api/admin/entries/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(entry)
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error updating entry:', error);
            return { success: false, error: 'Connection error' };
        }
    }

    async deleteEntry(id) {
        if (!this.isAdmin) {
            return { success: false, error: 'Admin access required' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/api/admin/entries/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
            return { success: false, error: 'Connection error' };
        }
    }

    async importEntries(entries) {
        if (!this.isAdmin) {
            return { success: false, error: 'Admin access required' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/api/admin/import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ entries })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, imported: data.imported };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error importing entries:', error);
            return { success: false, error: 'Connection error' };
        }
    }

    async exportEntries() {
        if (!this.isAdmin) {
            return { success: false, error: 'Admin access required' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/api/admin/export`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, entries: data.entries };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error exporting entries:', error);
            return { success: false, error: 'Connection error' };
        }
    }

    async clearAllData() {
        if (!this.isAdmin) {
            return { success: false, error: 'Admin access required' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/api/admin/clear-all`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error clearing data:', error);
            return { success: false, error: 'Connection error' };
        }
    }

    async getSettings() {
        if (!this.isAdmin) {
            return { success: false, error: 'Admin access required' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/api/admin/settings`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, settings: data.settings };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            return { success: false, error: 'Connection error' };
        }
    }

    async updateSettings(settings) {
        if (!this.isAdmin) {
            return { success: false, error: 'Admin access required' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/api/admin/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(settings)
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            return { success: false, error: 'Connection error' };
        }
    }
}

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MediaTrackerAPI;
}
