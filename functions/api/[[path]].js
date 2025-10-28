/**
 * Cloudflare Pages Function for Media Tracker API
 * File: functions/api/[[path]].js
 * This handles ALL routes under /api/*
 */

// Hash password using Web Crypto API
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Verify password
async function verifyPassword(password, storedHash) {
  const hash = await hashPassword(password);
  return hash === storedHash;
}

// Generate session token
function generateToken() {
  return crypto.randomUUID();
}

// Initialize database schema
async function initDatabase(env) {
  try {
    // Create entries table
    await env.DB.prepare(`
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
    `).run();

    // Create admin settings table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        password_hash TEXT NOT NULL,
        auto_sync INTEGER DEFAULT 0,
        last_sync TEXT
      )
    `).run();

    // Create sessions table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        expires_at TEXT NOT NULL
      )
    `).run();

    // Initialize admin password (play123)
    const passwordHash = await hashPassword('play123');
    await env.DB.prepare(
      `INSERT OR IGNORE INTO admin_settings (id, password_hash) VALUES (1, ?)`
    ).bind(passwordHash).run();
  } catch (error) {
    console.error('Database init error:', error);
  }
}

// Verify admin session
async function verifyAdminSession(env, token) {
  if (!token) return false;

  try {
    const session = await env.DB.prepare(
      `SELECT * FROM sessions WHERE token = ? AND datetime(expires_at) > datetime('now')`
    ).bind(token).first();
    return !!session;
  } catch {
    return false;
  }
}

// JSON response helper
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}

// Main request handler
export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const method = request.method;
  
  // Get the path after /api/
  const pathParts = params.path || [];
  const path = '/' + (Array.isArray(pathParts) ? pathParts.join('/') : pathParts);

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      }
    });
  }

  try {
    // Initialize database on first request
    await initDatabase(env);

    // Public endpoints
    if (method === 'GET' && path === '/entries') {
      const { searchParams } = url;
      const date = searchParams.get('date');
      const month = searchParams.get('month');
      const search = searchParams.get('search');

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

      let stmt = env.DB.prepare(query);
      params.forEach(param => {
        stmt = stmt.bind(param);
      });

      const { results } = await stmt.all();
      return jsonResponse({ entries: results || [] });
    }

    if (method === 'GET' && path === '/stats') {
      const { results } = await env.DB.prepare(`
        SELECT 
          COUNT(*) as total,
          mediaType,
          COUNT(*) as count,
          SUM(CASE WHEN strftime('%Y-%m', date) = strftime('%Y-%m', 'now') THEN 1 ELSE 0 END) as thisMonth,
          SUM(CASE WHEN strftime('%Y', date) = strftime('%Y', 'now') THEN 1 ELSE 0 END) as thisYear
        FROM entries
        GROUP BY mediaType
      `).all();

      const stats = {
        total: 0,
        thisMonth: 0,
        thisYear: 0,
        byType: {}
      };

      if (results) {
        results.forEach(row => {
          stats.total += row.count;
          stats.thisMonth += row.thisMonth || 0;
          stats.thisYear += row.thisYear || 0;
          stats.byType[row.mediaType] = row.count;
        });
      }

      return jsonResponse(stats);
    }

    if (method === 'GET' && path === '/dates') {
      const { results } = await env.DB.prepare(`
        SELECT DISTINCT date, COUNT(*) as count
        FROM entries
        GROUP BY date
        ORDER BY date DESC
      `).all();

      return jsonResponse({ dates: results || [] });
    }

    // Admin login
    if (method === 'POST' && path === '/admin/login') {
      const body = await request.json();
      const { password } = body;

      const settings = await env.DB.prepare(
        'SELECT password_hash FROM admin_settings WHERE id = 1'
      ).first();

      if (!settings) {
        return jsonResponse({ error: 'Configuration error' }, 500);
      }

      const isValid = await verifyPassword(password, settings.password_hash);

      if (isValid) {
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        await env.DB.prepare(
          'INSERT INTO sessions (token, expires_at) VALUES (?, ?)'
        ).bind(token, expiresAt).run();

        return jsonResponse({ success: true, token, expiresAt });
      }

      return jsonResponse({ error: 'Invalid password' }, 401);
    }

    // Admin endpoints (require authentication)
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (path.startsWith('/admin/') && path !== '/admin/login') {
      const isAdmin = await verifyAdminSession(env, token);
      if (!isAdmin) {
        return jsonResponse({ error: 'Authentication required' }, 401);
      }
    }

    // Admin logout
    if (method === 'POST' && path === '/admin/logout') {
      await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
      return jsonResponse({ success: true });
    }

    // Verify session
    if (method === 'GET' && path === '/admin/verify') {
      return jsonResponse({ valid: true });
    }

    // Create entry
    if (method === 'POST' && path === '/admin/entries') {
      const entry = await request.json();
      const { title, mediaType, creator, rating, url, date, notes } = entry;

      if (!title || !mediaType || !date) {
        return jsonResponse({ error: 'Title, mediaType, and date required' }, 400);
      }

      const result = await env.DB.prepare(`
        INSERT INTO entries (title, mediaType, creator, rating, url, date, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(title, mediaType, creator, rating, url, date, notes).run();

      return jsonResponse({
        success: true,
        id: result.meta.last_row_id,
        entry: { id: result.meta.last_row_id, ...entry }
      });
    }

    // Update entry
    if (method === 'PUT' && path.match(/^\/admin\/entries\/\d+$/)) {
      const id = path.split('/').pop();
      const entry = await request.json();
      const { title, mediaType, creator, rating, url, date, notes } = entry;

      const result = await env.DB.prepare(`
        UPDATE entries 
        SET title = ?, mediaType = ?, creator = ?, rating = ?, url = ?, date = ?, notes = ?,
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(title, mediaType, creator, rating, url, date, notes, id).run();

      if (result.meta.changes === 0) {
        return jsonResponse({ error: 'Entry not found' }, 404);
      }

      return jsonResponse({ success: true, updated: result.meta.changes });
    }

    // Delete entry
    if (method === 'DELETE' && path.match(/^\/admin\/entries\/\d+$/)) {
      const id = path.split('/').pop();

      const result = await env.DB.prepare('DELETE FROM entries WHERE id = ?').bind(id).run();

      if (result.meta.changes === 0) {
        return jsonResponse({ error: 'Entry not found' }, 404);
      }

      return jsonResponse({ success: true, deleted: result.meta.changes });
    }

    // Export entries
    if (method === 'GET' && path === '/admin/export') {
      const { results } = await env.DB.prepare('SELECT * FROM entries ORDER BY date DESC').all();
      return jsonResponse({ entries: results || [] });
    }

    // Import entries
    if (method === 'POST' && path === '/admin/import') {
      const { entries } = await request.json();

      if (!Array.isArray(entries)) {
        return jsonResponse({ error: 'Entries must be an array' }, 400);
      }

      let imported = 0;
      for (const entry of entries) {
        if (entry.title && entry.mediaType && entry.date) {
          await env.DB.prepare(`
            INSERT INTO entries (title, mediaType, creator, rating, url, date, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).bind(
            entry.title,
            entry.mediaType,
            entry.creator || null,
            entry.rating || null,
            entry.url || null,
            entry.date,
            entry.notes || null
          ).run();
          imported++;
        }
      }

      return jsonResponse({ success: true, imported });
    }

    // Clear all data
    if (method === 'DELETE' && path === '/admin/clear-all') {
      const result = await env.DB.prepare('DELETE FROM entries').run();
      return jsonResponse({ success: true, deleted: result.meta.changes });
    }

    // Settings endpoints
    if (method === 'GET' && path === '/admin/settings') {
      const settings = await env.DB.prepare(
        'SELECT auto_sync, last_sync FROM admin_settings WHERE id = 1'
      ).first();
      return jsonResponse({ settings: settings || {} });
    }

    if (method === 'PUT' && path === '/admin/settings') {
      const { auto_sync } = await request.json();
      await env.DB.prepare(
        'UPDATE admin_settings SET auto_sync = ? WHERE id = 1'
      ).bind(auto_sync ? 1 : 0).run();
      return jsonResponse({ success: true });
    }

    // Not found
    return jsonResponse({ error: 'Not found', path }, 404);

  } catch (error) {
    console.error('API error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}
