# EchoBeats REST API Specification

All API endpoints are prefixed with `/api`.  
Authentication is handled via HTTP Bearer tokens sent in the `Authorization` header (`Authorization: Bearer <JWT>`).

---

## 🔐 1. Authentication & User Management

### `POST /api/users/register`
- **Description**: Registers a new user account and returns a 30-day JWT.
- **Auth Required**: No (Rate Limited: 20 req / 15 min).
- **Role Required**: Public.
- **Request Body**:
  ```json
  {
    "username": "music_lover",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "_id": "650000000000000000000004",
    "username": "music_lover",
    "email": "user@example.com",
    "role": "user",
    "token": "eyJhbGci..."
  }
  ```
- **Errors**: `400 Bad Request` (Validation), `409 Conflict` (Duplicate email/username).

---

### `POST /api/users/login`
- **Description**: Authenticates user credentials and returns JWT token.
- **Auth Required**: No (Rate Limited: 20 req / 15 min).
- **Role Required**: Public.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "_id": "650000000000000000000002",
    "username": "JohnDoe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGci..."
  }
  ```
- **Errors**: `400 Bad Request` (Missing fields), `401 Unauthorized` (Invalid credentials).

---

### `GET /api/users/profile`
- **Description**: Retrieves current authenticated user profile.
- **Auth Required**: Yes (`Bearer <token>`).
- **Response (200 OK)**:
  ```json
  {
    "_id": "650000000000000000000002",
    "username": "JohnDoe",
    "email": "john@example.com",
    "role": "user",
    "recentlyPlayed": [],
    "likedSongs": []
  }
  ```
- **Errors**: `401 Unauthorized`.

---

### `PUT /api/users/profile`
- **Description**: Updates user username, email, or password.
- **Auth Required**: Yes (`Bearer <token>`).
- **Request Body**:
  ```json
  {
    "username": "JohnDoeNew",
    "password": "newpassword123"
  }
  ```
- **Response (200 OK)**: Returns updated profile payload with new JWT token.
- **Errors**: `400 Bad Request`, `401 Unauthorized`.

---

### `GET /api/users/likes`
- **Description**: Fetches array of liked song objects for current user.
- **Auth Required**: Yes (`Bearer <token>`).
- **Response (200 OK)**: Array of populated `Song` objects.
- **Errors**: `401 Unauthorized`.

---

### `GET /api/users/history`
- **Description**: Fetches paginated array of user listening history.
- **Auth Required**: Yes (`Bearer <token>`).
- **Query Params**: `?page=1&limit=40`
- **Response (200 OK)**:
  ```json
  {
    "history": [
      {
        "_id": "hist_001",
        "user": "650000000000000000000002",
        "song": { "title": "Subtle Waves", "artist": "EchoBeats" },
        "listenedFor": 180,
        "playedAt": "2026-08-31T00:00:00.000Z"
      }
    ],
    "page": 1,
    "pages": 1,
    "total": 1
  }
  ```

---

### `GET /api/users/analytics/dna`
- **Description**: Calculates Mood DNA analytics across 7 moods, peak listening hours, and personality badge.
- **Auth Required**: Yes (`Bearer <token>`).
- **Response (200 OK)**:
  ```json
  {
    "moodCounts": { "Chill": 5, "Party": 2, "Workout": 0, "Focus": 1, "Romantic": 0, "Happy": 0, "Sad": 0 },
    "topMood": "Chill",
    "badge": "Zen Harmonizer",
    "topArtists": [{ "artist": "EchoBeats", "count": 5 }],
    "peakHour": 20,
    "totalListeningMinutes": 24
  }
  ```

---

### `GET /api/users/timecapsule`
- **Description**: Returns memory capsule songs based on user history and date range.
- **Auth Required**: Yes (`Bearer <token>`).
- **Query Params**: `?from=Last 30 Days&to=Now`
- **Response (200 OK)**: `{ "range": {...}, "totalPlays": 10, "songs": [...] }`

---

## 🎵 2. Songs API

### `GET /api/songs`
- **Description**: Fetches audio tracks catalog with optional mood filtering or search query.
- **Auth Required**: No.
- **Query Params**: `?mood=Chill`, `?q=waves`
- **Response (200 OK)**: Array of `Song` objects.

---

### `GET /api/songs/:id`
- **Description**: Fetches single track by ID.
- **Auth Required**: No.
- **Response (200 OK)**: `Song` object.

---

### `POST /api/songs`
- **Description**: Admin track creation.
- **Auth Required**: Yes (`Bearer <token>`).
- **Role Required**: Admin.
- **Request Body**: `{ "title": "New Track", "artist": "Artist", "url": "https://..." }`
- **Errors**: `403 Forbidden` (Non-admin), `400 Bad Request`.

---

### `POST /api/songs/:id/like`
- **Description**: Toggles like status of song for authenticated user.
- **Auth Required**: Yes (`Bearer <token>`).
- **Response (200 OK)**: `{ "success": true, "isLiked": true, "songId": "..." }`

---

### `POST /api/songs/:id/play`
- **Description**: Logs track playback duration event.
- **Auth Required**: Yes (`Bearer <token>`).
- **Request Body**: `{ "listenedFor": 45 }` (Enforces bounds: 1 to 3600 seconds).
- **Response (200 OK)**: `{ "success": true, "message": "Playback logged successfully" }`

---

## 🎼 3. Playlist API (Ownership Enforced)

### `POST /api/playlists`
- **Description**: Creates a new custom playlist owned by authenticated user.
- **Auth Required**: Yes (`Bearer <token>`).
- **Request Body**: `{ "name": "Chill Mix", "description": "Late night beats", "isPublic": false }`
- **Response (201 Created)**: Created `Playlist` object.

---

### `GET /api/playlists`
- **Description**: Fetches custom playlists owned by current user.
- **Auth Required**: Yes (`Bearer <token>`).
- **Response (200 OK)**: Array of user `Playlist` objects.

---

### `GET /api/playlists/:id`
- **Description**: Fetches single playlist by ID (Access allowed only if public or owned by user).
- **Auth Required**: Yes (`Bearer <token>`).
- **Errors**: `403 Forbidden` (Private playlist owned by another user), `404 Not Found`.

---

### `PUT /api/playlists/:id`
- **Description**: Updates playlist name, description, tracks, or public visibility (Owner only).
- **Auth Required**: Yes (`Bearer <token>`).
- **Errors**: `403 Forbidden` (If caller is not playlist owner).

---

### `DELETE /api/playlists/:id`
- **Description**: Deletes custom playlist (Owner only).
- **Auth Required**: Yes (`Bearer <token>`).
- **Response (200 OK)**: `{ "success": true, "message": "Playlist removed" }`
- **Errors**: `403 Forbidden` (If caller is not playlist owner).

---

### `POST /api/playlists/:id/songs`
- **Description**: Adds song to playlist (Owner only).
- **Auth Required**: Yes (`Bearer <token>`).
- **Request Body**: `{ "songId": "650000000000000000000100" }`

---

### `DELETE /api/playlists/:id/songs/:songId`
- **Description**: Removes song from playlist (Owner only).
- **Auth Required**: Yes (`Bearer <token>`).
- **Errors**: `403 Forbidden` (If caller is not playlist owner).
