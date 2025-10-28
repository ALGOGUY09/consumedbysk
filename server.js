const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize SQLite Database
const db = new sqlite3.Database('./media_tracker.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

// Initialize database schema
function initDatabase() {
    db.serialize(() => {
        // Create entries table
        db.run(`
            CREATE TABLE IF NOT EXISTS entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                mediaType TEXT NOT NULL,
                creator TEXT,
                rating INTEGER,
                url TEXT,
                date TEXT NOT NULL,
                notes TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create admin settings table
        db.run(`
            CREATE TABLE IF NOT EXISTS admin_settings (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                password_hash TEXT NOT NULL,
                auto_sync INTEGER DEFAULT 0,
                last_sync TEXT
            )
        `);

        // Create sessions table for admin authentication
        db.run(`
            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                expires_at TEXT NOT NULL
            )
        `);

        // Initialize admin password (play123)
        const passwordHash = bcrypt.hashSync('play123', 10);
        db.run(
            `INSERT OR IGNORE INTO admin_settings (id, password_hash) VALUES (1, ?)`,
            [passwordHash],
            (err) => {
                if (err) {
                    console.error('Error initializing admin settings:', err);
                } else {
                    console.log('Admin settings initialized');
                }
            }
        );
    });
}

// Middleware to check admin authentication
function requireAdmin(req, res, next) {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    db.get(
        `SELECT * FROM sessions WHERE token = ? AND datetime(expires_at) > datetime('now')`,
        [token],
        (err, session) => {
            if (err || !session) {
                return res.status(401).json({ error: 'Invalid or expired session' });
            }
            next();
        }
    );
}

// ===== PUBLIC ENDPOINTS (Read-only) =====

// Get all entries (public view)
app.get('/api/entries', (req, res) => {
    const { date, month, search } = req.query;
    let query = 'SELECT * FROM entries WHERE 1=1';
    const params = [];

    if (date) {
        query += ' AND date = ?';
        params.push(date);
    }

    if (month) {
        query += ' AND strftime("%Y-%m", date) = ?';
        params.push(month);
    }

    if (search) {
        query += ' AND (title LIKE ? OR notes LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY date DESC, createdAt DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ entries: rows });
    });
});

// Get statistics (public view)
app.get('/api/stats', (req, res) => {
    db.all(`
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN strftime('%Y-%m', date) = strftime('%Y-%m', 'now') THEN 1 END) as thisMonth,
            COUNT(CASE WHEN strftime('%Y', date) = strftime('%Y', 'now') THEN 1 END) as thisYear,
            mediaType,
            COUNT(*) as count
        FROM entries
        GROUP BY mediaType
    `, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const stats = {
            total: 0,
            thisMonth: 0,
            thisYear: 0,
            byType: {}
        };

        rows.forEach(row => {
            if (row.total) stats.total = row.total;
            if (row.thisMonth) stats.thisMonth = row.thisMonth;
            if (row.thisYear) stats.thisYear = row.thisYear;
            if (row.mediaType) {
                stats.byType[row.mediaType] = row.count;
            }
        });

        res.json(stats);
    });
});

// Get dates list (public view)
app.get('/api/dates', (req, res) => {
    db.all(`
        SELECT DISTINCT date, COUNT(*) as count
        FROM entries
        GROUP BY date
        ORDER BY date DESC
    `, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ dates: rows });
    });
});

// ===== ADMIN ENDPOINTS (Authentication required) =====

// Admin login
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password required' });
    }

    db.get('SELECT password_hash FROM admin_settings WHERE id = 1', (err, row) => {
        if (err || !row) {
            return res.status(500).json({ error: 'Server error' });
        }

        if (bcrypt.compareSync(password, row.password_hash)) {
            // Generate session token
            const token = require('crypto').randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

            db.run(
                'INSERT INTO sessions (token, expires_at) VALUES (?, ?)',
                [token, expiresAt],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to create session' });
                    }
                    res.json({ 
                        success: true, 
                        token,
                        expiresAt 
                    });
                }
            );
        } else {
            res.status(401).json({ error: 'Invalid password' });
        }
    });
});

// Admin logout
app.post('/api/admin/logout', requireAdmin, (req, res) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    
    db.run('DELETE FROM sessions WHERE token = ?', [token], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ success: true });
    });
});

// Verify admin session
app.get('/api/admin/verify', requireAdmin, (req, res) => {
    res.json({ valid: true });
});

// Create entry (admin only)
app.post('/api/admin/entries', requireAdmin, (req, res) => {
    const { title, mediaType, creator, rating, url, date, notes } = req.body;

    if (!title || !mediaType || !date) {
        return res.status(400).json({ error: 'Title, mediaType, and date are required' });
    }

    db.run(
        `INSERT INTO entries (title, mediaType, creator, rating, url, date, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, mediaType, creator, rating, url, date, notes],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ 
                success: true, 
                id: this.lastID,
                entry: { id: this.lastID, title, mediaType, creator, rating, url, date, notes }
            });
        }
    );
});

// Update entry (admin only)
app.put('/api/admin/entries/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const { title, mediaType, creator, rating, url, date, notes } = req.body;

    db.run(
        `UPDATE entries 
         SET title = ?, mediaType = ?, creator = ?, rating = ?, url = ?, date = ?, notes = ?, 
             updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [title, mediaType, creator, rating, url, date, notes, id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Entry not found' });
            }
            res.json({ success: true, updated: this.changes });
        }
    );
});

// Delete entry (admin only)
app.delete('/api/admin/entries/:id', requireAdmin, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM entries WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.json({ success: true, deleted: this.changes });
    });
});

// Bulk import entries (admin only)
app.post('/api/admin/import', requireAdmin, (req, res) => {
    const { entries } = req.body;

    if (!Array.isArray(entries)) {
        return res.status(400).json({ error: 'Entries must be an array' });
    }

    const stmt = db.prepare(
        `INSERT INTO entries (title, mediaType, creator, rating, url, date, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
    );

    let imported = 0;
    entries.forEach(entry => {
        if (entry.title && entry.mediaType && entry.date) {
            stmt.run([
                entry.title,
                entry.mediaType,
                entry.creator || null,
                entry.rating || null,
                entry.url || null,
                entry.date,
                entry.notes || null
            ]);
            imported++;
        }
    });

    stmt.finalize((err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, imported });
    });
});

// Export all entries (admin only)
app.get('/api/admin/export', requireAdmin, (req, res) => {
    db.all('SELECT * FROM entries ORDER BY date DESC', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ entries: rows });
    });
});

// Clear all data (admin only)
app.delete('/api/admin/clear-all', requireAdmin, (req, res) => {
    db.run('DELETE FROM entries', function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, deleted: this.changes });
    });
});

// Update admin settings (admin only)
app.put('/api/admin/settings', requireAdmin, (req, res) => {
    const { auto_sync } = req.body;

    db.run(
        'UPDATE admin_settings SET auto_sync = ? WHERE id = 1',
        [auto_sync ? 1 : 0],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true });
        }
    );
});

// Get admin settings (admin only)
app.get('/api/admin/settings', requireAdmin, (req, res) => {
    db.get('SELECT auto_sync, last_sync FROM admin_settings WHERE id = 1', (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ settings: row });
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
