# Backend Database Setup Guide

This guide explains how to set up and use the backend database system for admin purposes with view-only mode for public users.

## Overview

The Media Tracker now includes a Node.js backend with SQLite database that provides:
- **Public View-Only Mode**: Anyone can view entries without authentication
- **Admin Edit Mode**: Password-protected access to create, edit, and delete entries
- **RESTful API**: Clean API endpoints for all operations
- **Session Management**: Secure token-based authentication
- **Data Persistence**: SQLite database for reliable storage

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
# or
npm run dev
```

The server will start on `http://localhost:3000`

### 3. Access the Application

- **Public Users**: Can view all entries without login
- **Admin Users**: Use the login button and enter the admin password

## Architecture

### Database Schema

#### `entries` Table
Stores all media entries:
- `id` - Auto-incrementing primary key
- `title` - Media title (required)
- `mediaType` - Type of media: movie, tv, book, podcast, game, music (required)
- `creator` - Creator/author name (optional)
- `rating` - Rating 1-5 (optional)
- `url` - External link (optional)
- `date` - Date consumed (required)
- `notes` - Personal notes (optional)
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

#### `admin_settings` Table
Stores admin configuration:
- `id` - Always 1 (single row)
- `password_hash` - Bcrypt hashed admin password
- `auto_sync` - Auto-sync enabled flag
- `last_sync` - Last sync timestamp

#### `sessions` Table
Manages admin sessions:
- `token` - Session token (primary key)
- `created_at` - Session creation time
- `expires_at` - Session expiration time

### API Endpoints

#### Public Endpoints (No Authentication Required)

**GET /api/entries**
Get all entries with optional filtering
- Query params: `date`, `month`, `search`
- Returns: `{ entries: [...] }`

**GET /api/stats**
Get statistics about entries
- Returns: `{ total, thisMonth, thisYear, byType: {...} }`

**GET /api/dates**
Get list of all dates with entry counts
- Returns: `{ dates: [...] }`

#### Admin Endpoints (Authentication Required)

**POST /api/admin/login**
Authenticate as admin
- Body: `{ password: "play123" }`
- Returns: `{ success: true, token: "...", expiresAt: "..." }`

**POST /api/admin/logout**
End admin session
- Headers: `Authorization: Bearer <token>`
- Returns: `{ success: true }`

**GET /api/admin/verify**
Verify admin session is valid
- Headers: `Authorization: Bearer <token>`
- Returns: `{ valid: true }`

**POST /api/admin/entries**
Create new entry
- Headers: `Authorization: Bearer <token>`
- Body: `{ title, mediaType, creator, rating, url, date, notes }`
- Returns: `{ success: true, id, entry: {...} }`

**PUT /api/admin/entries/:id**
Update existing entry
- Headers: `Authorization: Bearer <token>`
- Body: `{ title, mediaType, creator, rating, url, date, notes }`
- Returns: `{ success: true, updated: 1 }`

**DELETE /api/admin/entries/:id**
Delete entry
- Headers: `Authorization: Bearer <token>`
- Returns: `{ success: true, deleted: 1 }`

**POST /api/admin/import**
Bulk import entries
- Headers: `Authorization: Bearer <token>`
- Body: `{ entries: [...] }`
- Returns: `{ success: true, imported: N }`

**GET /api/admin/export**
Export all entries
- Headers: `Authorization: Bearer <token>`
- Returns: `{ entries: [...] }`

**DELETE /api/admin/clear-all**
Delete all entries
- Headers: `Authorization: Bearer <token>`
- Returns: `{ success: true, deleted: N }`

**GET /api/admin/settings**
Get admin settings
- Headers: `Authorization: Bearer <token>`
- Returns: `{ settings: {...} }`

**PUT /api/admin/settings**
Update admin settings
- Headers: `Authorization: Bearer <token>`
- Body: `{ auto_sync: true/false }`
- Returns: `{ success: true }`

## Frontend Integration

### Using the API Client

The frontend uses `api-client.js` to communicate with the backend:

```javascript
// Initialize API client
const api = new MediaTrackerAPI();

// Public access - view entries
const result = await api.getEntries({ date: '2025-10-28' });
if (result.success) {
    console.log(result.entries);
}

// Admin login
const loginResult = await api.login('play123');
if (loginResult.success) {
    console.log('Admin logged in!');
}

// Admin actions - create entry
if (api.isAdmin) {
    const entry = {
        title: 'The Matrix',
        mediaType: 'movie',
        date: '2025-10-28',
        rating: 5
    };
    const createResult = await api.createEntry(entry);
}
```

### Admin vs Public Mode

The frontend automatically detects admin status:
- **Public Mode**: Shows all entries in read-only mode
  - No "Add Entry" button
  - No edit/delete options on cards
  - All data is visible but not modifiable
  
- **Admin Mode**: Full edit capabilities
  - "Add Entry" button visible
  - Edit/delete buttons on entry cards
  - Access to admin panel
  - Export/import functionality

## Security Features

1. **Password Hashing**: Admin password stored as bcrypt hash
2. **Token-Based Auth**: Session tokens with expiration
3. **Secure Sessions**: Automatic cleanup of expired sessions
4. **CORS Protection**: Configurable CORS policies
5. **Input Validation**: All inputs validated before database operations

## Database Management

### Backup Database

The SQLite database file is `media_tracker.db`. To backup:

```bash
# Copy the database file
cp media_tracker.db media_tracker_backup_$(date +%Y%m%d).db
```

### Reset Database

To start fresh:

```bash
# Stop the server
# Delete the database file
rm media_tracker.db
# Restart the server - it will create a new database
npm start
```

### View Database Contents

Using SQLite CLI:

```bash
sqlite3 media_tracker.db

# View all entries
SELECT * FROM entries;

# View admin settings
SELECT * FROM admin_settings;

# Exit
.quit
```

## Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
NODE_ENV=production npm start
```

### Environment Variables

Create a `.env` file (see `.env.example`):
```
PORT=3000
NODE_ENV=production
DB_PATH=./media_tracker.db
SESSION_EXPIRY_HOURS=24
```

## Migration from Firebase

If you have existing data in Firebase:

1. Use the admin panel to download backup
2. Start the new backend server
3. Login as admin
4. Use the import functionality to upload the backup

## Troubleshooting

### Server won't start
- Check if port 3000 is available
- Verify all dependencies are installed: `npm install`
- Check for errors in console output

### Can't login as admin
- Verify the admin password hasn't been changed
- Clear browser localStorage and try again
- Check server logs for authentication errors

### Database errors
- Ensure write permissions for the application directory
- Check database file isn't corrupted
- Try resetting the database (see Database Management)

### API connection errors
- Verify server is running
- Check browser console for CORS errors
- Ensure API base URL is correct in frontend

## Future Enhancements

Planned features:
- [ ] Multiple admin users with roles
- [ ] Audit log for admin actions
- [ ] Database backup scheduling
- [ ] Export to various formats (CSV, PDF)
- [ ] Advanced search and filtering
- [ ] Real-time sync with WebSockets
- [ ] Mobile app with same backend

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Check browser console for errors
4. Verify API endpoints with tools like Postman

---

**Note**: Keep your admin password secure. The default password is stored in the database as a bcrypt hash and cannot be recovered if lost.
