# CineGlance

A full-stack movie discovery web application inspired by Netflix's interface. Browse trending, popular, top-rated, and upcoming movies/TV series, search for titles, view detailed information, manage favorites and watchlists, and get AI-powered movie recommendations via a built-in chat assistant.

## Tech Stack

**Frontend:** React 18, TypeScript, Vite 5, Redux Toolkit, Tailwind CSS 3, React Router 7, Material UI 5, Swiper 11  
**Backend:** Node.js, Express 4, MongoDB + Mongoose 7, JWT authentication, bcryptjs  
**AI:** OpenRouter (GPT-4o-mini) with RAG-based semantic movie search  
**APIs:** TMDB (primary), OMDB (fallback)

## Features

- **Hero Carousel** — Auto-rotating trending movies with backdrop, plot, genres, and ratings
- **Content Rows** — Horizontal scrollable rows for Trending, Popular, Top Rated, and Coming Soon
- **Movie Detail Page** — Full details including poster, backdrop, plot, genres, cast/crew, ratings, awards, and metadata
- **Discover / Search** — Filterable, paginated browsing by genre, year, country, and sort order for both movies and TV series
- **Genre & Country Browsing** — Sidebar filters for 18 genres and 10 countries
- **Global Search Overlay** — Debounced search-as-you-type with full-screen overlay
- **User Authentication** — Register, login, logout with JWT stored in HTTP-only cookies
- **Favorites & Watchlist** — Authenticated users can save movies and view them on their profile
- **AI Chat Assistant** — Floating chatbot that provides personalized movie recommendations using semantic search + LLM
- **Responsive Dark Theme** — Full mobile responsiveness with custom dark UI and accent colors
- **Skeleton Loading & Toast Notifications** — Polished UX with loading states and user feedback

## Project Structure

```
Movie-website/
├── backend/
│   ├── server.js              # Express entry point
│   ├── config/                # MongoDB & Redis configuration
│   ├── controllers/           # User controller (auth, favorites, watchlist)
│   ├── middleware/            # JWT auth & async error handler
│   ├── models/                # Mongoose User schema
│   ├── routes/                # API routes (users, movies, omdb, chat)
│   ├── services/              # TMDB integration & RAG chat service
│   ├── utils/                 # Error handler, JWT token, logger
│   └── scripts/               # Embedding seed script
├── frontend/
│   ├── src/
│   │   ├── components/        # Navbar, HeroSection, ContentRow, Movie, ChatAssistant, etc.
│   │   ├── pages/             # Movies, TVSeries, Genre, Country, Login, Register, Profile
│   │   ├── redux/             # Redux store, slices (user, movie, chat), selectors
│   │   ├── services/          # API service layer (auth, omdb, chat)
│   │   └── utils/             # Gradient background mappings
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or Atlas)
- API keys: TMDB API key, OpenRouter API key, OMDB API key (fallback)

### Backend Setup

```bash
cd backend
npm install
```

Create/verify `.env` with the following variables:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `TMDB_API_KEY` | TMDB Bearer token |
| `OMDB_API_KEY` | OMDB API key (fallback) |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI chat |
| `PORT` | Server port (default 5000) |

```bash
npm run dev    # Development with nodemon
npm start      # Production
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev    # Vite dev server on port 5173
npm run build  # Production build
npm run preview
```

The frontend auto-detects environment and points API calls to `http://localhost:5000` (dev) or the deployed backend URL (production).

## API Routes

| Group | Endpoints |
|---|---|
| **Auth** | `POST /api/v1/users/register`, `POST /api/v1/users/login`, `GET /api/v1/users/logout` |
| **Profile** | `GET /api/v1/users/me`, `PUT /api/v1/users/me/update`, `PUT /api/v1/users/password/update` |
| **Favorites** | `POST /api/v1/users/favorites`, `DELETE /api/v1/users/favorites/:id` |
| **Watchlist** | `POST /api/v1/users/watchlist`, `DELETE /api/v1/users/watchlist/:id` |
| **Movies** | `GET /api/v1/movies/trending\|popular\|top-rated\|upcoming`, `/search`, `/discover`, `/detail/:id`, `/similar/:id`, `/country/:code`, `/genres` |
| **TV** | `GET /api/v1/movies/tv` (discover) |
| **Chat** | `POST /api/v1/chat`, `GET /api/v1/chat/seed-status`, `POST /api/v1/chat/seed` |
