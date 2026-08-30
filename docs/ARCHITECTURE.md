# EchoBeats Technical Architecture & Engineering Design

This document details the high-level system topology, data boundaries, security controls, and resilient state management architecture of the EchoBeats platform.

---

## 🏛️ 1. High-Level System Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                        User Web Browser (SPA)                          │
│                                                                        │
│   ┌─────────────────────┐    ┌──────────────────┐    ┌──────────────┐  │
│   │ React 18 UI Shell   │    │ PlayerContext    │    │ Audio Engine │  │
│   │ Tailwind & Lucide   │◄───┤ HTML5 & Queue    │◄───┤ Canvas 60FPS │  │
│   └──────────┬──────────┘    └──────────────────┘    └──────────────┘  │
└──────────────┼─────────────────────────────────────────────────────────┘
               │ Axios HTTP Requests (Bearer JWT)
               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Node.js / Express API                           │
│                                                                        │
│   ┌─────────────────────┐    ┌──────────────────┐    ┌──────────────┐  │
│   │ Security Layer      │    │ Express Routers  │    │ Controllers  │  │
│   │ Helmet & Limiter    │───►│ /users, /songs   │───►│ Business     │  │
│   └─────────────────────┘    └──────────────────┘    └──────┬───────┘  │
└──────────────────────────────────────────────────────────────┼─────────┘
                                                               │
               ┌───────────────────────────────────────────────┴────────┐
               ▼                                                        ▼
┌─────────────────────────────┐                         ┌─────────────────────┐
│ MongoDB Atlas (Primary SRV) │ ──(Auto-Fallback)──────►│ Memory UserRegistry │
└─────────────────────────────┘                         └─────────────────────┘
```

---

## 🔒 2. Security Boundaries & Isolation Strategy

1. **Authentication Boundary (`authMiddleware.js`)**:
   - Every protected route verifies incoming HTTP Bearer tokens using JWT verification (`jwt.verify`).
   - Standardized 401 Unauthorized responses prevent unauthenticated request processing.
2. **Authorization Boundary (RBAC & IDOR Defense)**:
   - Admin routes (`POST /api/songs`) strictly enforce `req.user.role === 'admin'`, returning `403 Forbidden` if unauthorized.
   - Resource Ownership Check: Playlist mutation controllers (`PUT /api/playlists/:id`, `DELETE /api/playlists/:id`, etc.) verify `playlist.user.toString() === req.user._id.toString()`. Access to another user's private resources is blocked with `403 Forbidden`.
3. **Password Security**:
   - Passwords are pre-hashed and stored using `bcryptjs` with salt factor 10. Passwords are never returned in API responses.
   - Persistent `userRegistry` maintains BCrypt hashes locally so fallback logins verify passwords securely.

---

## ⚡ 3. 4-Tier Database Resiliency Strategy

EchoBeats implements a 4-tier database connection fallback chain in `backend/config/db.js`:

1. **Primary MongoDB Atlas (SRV)**: Connection attempted with 4000ms timeout limit.
2. **Direct Standard Atlas Nodes**: Bypasses local ISP DNS SRV restrictions.
3. **Local MongoDB Daemon**: Connects to `mongodb://127.0.0.1:27017/echobeats` if available.
4. **MongoMemoryServer (Binary Fallback)**: In-memory MongoDB instance with fast auto-seeding.

---

## 🎧 4. Player Context & Audio Pipeline Architecture

- **Global Player Context (`PlayerContext.jsx`)**: Encapsulates HTML5 `Audio` instance, playback timer listeners, queue management, volume persistence, and duration logging triggers.
- **Procedural Canvas Visualizer (`Visualizer.jsx`)**: 60 FPS Canvas visualizer utilizing `requestAnimationFrame` and mood color gradient shading. Clean animation frame cleanup on unmount.
- **Audio Equalizer (`Equalizer.jsx`)**: Preset selector (`Flat`, `Bass Boost`, `Vocal Clarity`, `Club`, `Acoustic`) with animated frequency bars.
