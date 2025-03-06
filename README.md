<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Spider Football API 🕷️⚽</h1>

<p align="center">
  A powerful REST API for retrieving football (soccer) data including leagues and matches. Built with NestJS and Firebase.
</p>

<p align="center">
  <strong>🌐 Production API: </strong><a href="https://api.spider.football">api.spider.football</a>
</p>

<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
</p>

## API Base URL 🌐

All API requests should be made to:
```http
https://api.spider.football
```

Example request:
```http
GET https://api.spider.football/leagues
```

## Features 🌟

- **Authentication System**
  - Secure user registration and login
  - JWT-based authentication
  - Protected routes with Passport
  - Rate limiting and security features

- **Leagues**
  - Get all leagues
  - Get league details
  - Get league standings
  - Search leagues by country
  - Real-time standings updates

- **Matches**
  - Get live matches
  - Get match details
  - Get match statistics
  - Filter matches by date
  - Search matches by team
  - Real-time match updates

## Tech Stack 💻

- **Framework**: NestJS
- **Database**: Firebase/Firestore
- **Authentication**: JWT + Passport
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **CI/CD**: GitHub Actions
- **Monitoring**: Firebase Analytics
- **Caching**: Redis

## Prerequisites 📋

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Redis (optional, for caching)

## Environment Variables 🔑

Create a `.env` file in the root directory:

```env
# Application
PORT=3000
NODE_ENV=development

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

## Installation 🔧

1. Clone the repository
```bash
git clone https://github.com/yourusername/spider-football-api.git
cd spider-football-api
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

## Running the app 🚀

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## API Documentation 📚

### Authentication Endpoints

```http
POST /auth/register
POST /auth/login
```

Example register request:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

Example successful response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Leagues Endpoints

```http
GET /leagues
GET /leagues/:id
GET /leagues/:id/standings
GET /leagues/search?country=:country
```

Example response for `/leagues/:id/standings`:
```json
{
  "league": {
    "id": "league123",
    "name": "Premier League",
    "country": "England"
  },
  "standings": [
    {
      "position": 1,
      "team": "Manchester City",
      "played": 38,
      "points": 89,
      "won": 28,
      "drawn": 5,
      "lost": 5
    }
  ]
}
```

### Matches Endpoints

```http
GET /matches
GET /matches/live
GET /matches/:id
GET /matches/:id/statistics
GET /matches/search?team=:teamName
```

Example response for `/matches/live`:
```json
{
  "matches": [
    {
      "id": "match123",
      "homeTeam": "Barcelona",
      "awayTeam": "Real Madrid",
      "score": {
        "home": 2,
        "away": 1
      },
      "status": "LIVE",
      "minute": 75
    }
  ]
}
```

## Authentication Flow 🔐

1. Register a new account:
   ```http
   POST /auth/register
   Content-Type: application/json

   {
     "email": "user@example.com",
     "password": "securePassword123",
     "name": "John Doe"
   }
   ```

2. Login to get JWT token:
   ```http
   POST /auth/login
   Content-Type: application/json

   {
     "email": "user@example.com",
     "password": "securePassword123"
   }
   ```

3. Use the token in subsequent requests:
   ```http
   GET /matches
   Authorization: Bearer your_jwt_token
   ```

## Error Handling ⚠️

The API uses standard HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

Error responses follow this format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request",
  "timestamp": "2024-03-06T12:00:00Z",
  "path": "/api/endpoint"
}
```

## Rate Limiting 🚦

The API implements rate limiting to prevent abuse:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit headers in response:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1583497200
```

## Testing ✅

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Database Schema 📊

Key collections in Firestore:

- `accounts`: User accounts and authentication data
  ```typescript
  interface Account {
    id: string;
    email: string;
    password: string; // hashed
    name: string;
    createdAt: Timestamp;
  }
  ```

- `leagues`: League information and standings
  ```typescript
  interface League {
    id: string;
    name: string;
    country: string;
    season: string;
    standings: Standing[];
  }
  ```

- `matches`: Match data and statistics
  ```typescript
  interface Match {
    id: string;
    leagueId: string;
    homeTeam: string;
    awayTeam: string;
    score: Score;
    status: MatchStatus;
    startTime: Timestamp;
    statistics: Statistics;
  }
  ```

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support 💪

If you find any bugs or have feature requests, please create an issue in the GitHub repository.

## Stay in touch 📫

- Website - [api.spider.football](https://api.spider.football)
- Documentation - [docs.spider.football](https://docs.spider.football)
- Status - [status.spider.football](https://status.spider.football)

## License 📝

This project is [MIT licensed](LICENSE).
