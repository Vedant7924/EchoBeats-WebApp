# Phase 0 Baseline Engineering Audit — EchoBeats

**Target Project**: EchoBeats — Full-Stack MERN Music Streaming Platform  
**Audit Timestamp**: 2026-08-31  

---

## 1. Frontend Architecture
- **Framework & Build**: React 18, Vite 7, Tailwind CSS, Lucide Icons, React Router DOM v6.
- **Component Layout**: Single Page Application (SPA) driven by a core `Layout.jsx` wrapper containing `Sidebar.jsx` (navigation & user profile), main content route outlet, and `Player.jsx` (persistent bottom audio player).
- **Audio & State Management**: Global `PlayerContext.jsx` manages HTML5 Audio element instance, active track metadata, play/pause state, queue array, current index, repeat mode, shuffle mode, volume, and playback reporting timers.
- **Pages**:
  - `Home.jsx` — Hero banner & mood station song catalog grid.
  - `Search.jsx` — Multi-field search (title, artist, album, mood).
  - `Library.jsx` — User playlist management and playlist creation modal.
  - `Playlist.jsx` — Detailed playlist track listing and management.
  - `LikedSongs.jsx` — Saved favorites collection powered by `useLiked` hook.
  - `HistoryPage.jsx` — Date-formatted playback session log.
  - `MoodGenerator.jsx` — Mood-based station generator.
  - `Profile.jsx` — Mood DNA SVG Radar chart analytics & personality badges.
  - `TimeCapsule.jsx` — Memory playlist generator for past playback ranges.
  - `Login.jsx` / `Signup.jsx` — Authentication flows with Google OAuth placeholder.

## 2. Backend Architecture
- **Framework**: Node.js, Express.js 5.
- **API Entrypoint**: `backend/server.js` mounting `/api/users`, `/api/songs`, `/api/playlists`.
- **Middlewares**:
  - `authMiddleware.js` (`protect`, `admin`) — JWT verification & user attachment.
  - `rateLimiter.js` (`authLimiter`, `apiLimiter`) — Brute force protection (20 req / 15 min on auth, 300 req / min on API).
  - `errorMiddleware.js` (`notFound`, `errorHandler`) — Express error handling pipeline.
- **Database Connection Strategy (`config/db.js`)**:
  - Disable Mongoose buffering (`mongoose.set('bufferCommands', false)`).
  - 4-Tier Connection Fallback: Primary Atlas SRV $\rightarrow$ Direct Atlas Shard Nodes $\rightarrow$ Local MongoDB (`127.0.0.1:27017`) $\rightarrow$ MongoMemoryServer v7.0.3.
  - In-Memory Fallback Registry & Stores for smooth operation even when offline.

## 3. Database Models / Schema
- **User (`models/User.js`)**:
  - `username` (String, required, unique, trim)
  - `email` (String, required, unique, lowercase, trim)
  - `password` (String, required, bcrypt hashed)
  - `role` (String, enum: `['user', 'admin']`, default: `'user'`)
  - `recentlyPlayed` (Array of ObjectIds referencing `Song`)
  - `likedSongs` (Array of ObjectIds referencing `Song`)
  - Timestamps (`createdAt`, `updatedAt`)
- **Song (`models/Song.js`)**:
  - `title`, `artist`, `album`, `duration`, `url`, `coverArt`, `mood` (`['Chill', 'Party', 'Sad', 'Romantic', 'Workout', 'Focus', 'Happy']`), `plays`, `user`.
- **Playlist (`models/Playlist.js`)**:
  - `name`, `description`, `songs` (Array of ObjectIds referencing `Song`), `user` (ObjectId referencing `User`), `isPublic`.
- **History (`models/History.js`)**:
  - `user` (ObjectId referencing `User`), `song` (ObjectId referencing `Song`), `listenedFor`, `playedAt`.

## 4. Authentication Flow
- **Registration (`POST /api/users/register`)**: Validates username, email, password length ($\ge 6$), checks duplicate accounts, hashes password via `pre('save')` hook, returns JWT token.
- **Login (`POST /api/users/login`)**: Validates credentials via `bcrypt.compare`, returns user payload and 30-day JWT.
- **Client Persistence**: Token stored in `localStorage` (`echobeats-token`). Sent in HTTP headers via `Axios` interceptor (`Authorization: Bearer <token>`).

## 5. Authorization Flow
- **Backend Middleware**:
  - `protect`: Extracts Bearer token, verifies JWT, attaches `req.user`.
  - `admin`: Verifies `req.user.role === 'admin'`. Returns `403 Forbidden` if unauthorized.
- **Current Authorization Gap**:
  - Playlist mutation endpoints (`PUT /api/playlists/:id`, `DELETE /api/playlists/:id`, `POST /api/playlists/:id/songs`, `DELETE /api/playlists/:id/songs/:songId`) do not check if `playlist.user.toString() === req.user._id.toString()`. IDOR vulnerable.

## 6. API Routes
- **Users**: `/api/users/register`, `/api/users/login`, `/api/users/profile`, `/api/users/likes`, `/api/users/history`, `/api/users/analytics/dna`, `/api/users/timecapsule`.
- **Songs**: `GET /api/songs`, `POST /api/songs` (Admin), `GET /api/songs/:id`, `POST /api/songs/:id/like`, `POST /api/songs/:id/play`.
- **Playlists**: `GET /api/playlists`, `POST /api/playlists`, `GET /api/playlists/:id`, `PUT /api/playlists/:id`, `DELETE /api/playlists/:id`, `POST /api/playlists/:id/songs`, `DELETE /api/playlists/:id/songs/:songId`.

## 7. Frontend Routes
- Public: `/login`, `/signup`.
- Protected (Main Layout): `/`, `/search`, `/library`, `/playlist/:id`, `/liked`, `/history`, `/timecapsule`, `/profile`, `/mood`.

## 8. State Management
- `AuthContext.jsx`: User auth state, login, register, logout, local storage sync.
- `PlayerContext.jsx`: HTML5 audio engine ref, active track, queue, current index, volume, repeat, shuffle, seeking, playback history reporting.
- `useLiked.js`: Shared hook for liked songs set & optimistic toggle UI.

## 9. Error Handling
- Backend: Express error handler returns JSON `{ message: error.message, stack: ... }`. Needs standardization to `{ success: false, message: "...", code: "..." }`.
- Frontend: React-Toastify for user feedback notifications. Toast notifications on API failures.

## 10. Validation
- Helper `utils/validation.js` provides `validateEmail`, `validatePassword`, `validateUsername`.
- Missing checks for empty whitespace strings, malicious injection strings, malformed MongoDB ObjectIds, and bounds on query parameters.

## 11. Security Controls
- Helmet headers enabled.
- CORS restricted via `CORS_ORIGIN` env or default allow-list.
- Rate limiting active on Auth (20 req / 15 min) and API (300 req / min).
- Passwords hashed via Bcrypt (salt rounds 10).

## 12. Environment Variables
- `PORT` (Default: 5000)
- `MONGO_URI` (MongoDB connection string)
- `JWT_SECRET` (JWT signing secret)
- `NODE_ENV` (`development` | `production` | `test`)
- `CORS_ORIGIN` (Allowed frontend origin)

## 13. Deployment Configuration
- Vercel Serverless monorepo via `vercel.json` and `/api/index.js` bridge.
- Static frontend build in `frontend/dist`.

## 14. Testing Setup
- Jest, Supertest, MongoMemoryServer configured in `backend/package.json`.
- Unit tests present in `backend/tests/auth.test.js`. Needs expansion for full API suite.

## 15. Existing Bugs & Audit Findings
1. **Credential Persistence Discrepancy**: Newly registered users or password changes in memory fallback mode are lost across server restarts because they were not persisted to an in-memory user registry.
2. **Playlist IDOR / Lack of Ownership Check**: Any logged-in user can update or delete another user's playlist by calling `PUT /api/playlists/:id` or `DELETE /api/playlists/:id`.
3. **Inconsistent Error Response Structure**: Backend returns `{ message: "..." }` instead of structured `{ success: false, message: "...", code: "..." }`.
4. **Debounce Missing on Search**: `Search.jsx` sends API request on every keystroke without debouncing.
5. **Web Audio / Equalizer Node Re-creation**: Web Audio context in `Equalizer.jsx` recreates audio nodes on render.

## 16. Existing TODOs
- Complete CI/CD GitHub Actions pipeline.
- Implement comprehensive unit and integration test coverage.
- Add complete `/docs/` technical documentation set (`API.md`, `ARCHITECTURE.md`, `QA_CHECKLIST.md`, `FINAL_ENGINEERING_REPORT.md`).

## 17. Duplicate/Dead Code
- Cleaned up obsolete standalone scripts (`verifyLogin.js`).

## 18. Dependency Issues
- Audit frontend and backend npm packages for unused or outdated dependencies.

## 19. Performance Issues
- Lack of debouncing in Search page.
- Need query optimization & explicit Mongo index documentation.

## 20. Accessibility Issues
- Missing ARIA labels on audio player controls and modal close buttons.

## 21. Responsive-Design Issues
- Player bottom bar layout fixed with `left-0 md:left-64` to prevent obstructing sidebar profile on desktop.

## 22. README / Setup Problems
- Document safe `.env.example` files and explicit local setup steps.
