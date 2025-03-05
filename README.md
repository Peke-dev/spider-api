<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Spider Football API 🕷️⚽</h1>

<p align="center">
  A powerful REST API for retrieving football (soccer) data including leagues, matches, and teams. Built with NestJS and Firebase.
</p>

<p align="center">
  <strong>🌐 API URL: </strong><a href="https://api.spider.football">api.spider.football</a>
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

- **Leagues**
  - Get all leagues
  - Get league details
  - Get league standings
  - Search leagues by country

- **Matches**
  - Get live matches
  - Get match details
  - Get match statistics
  - Filter matches by date
  - Search matches by team

- **Teams**
  - Get team information
  - Get team squad
  - Get team statistics
  - Search teams by name

## Tech Stack 💻

- **Framework**: NestJS
- **Database**: Firebase/Firestore
- **Authentication**: JWT + Passport
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **CI/CD**: GitHub Actions

## Prerequisites 📋

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

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

Fill in the following environment variables:
```env
JWT_SECRET=your_jwt_secret
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
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

### Leagues Endpoints

```http
GET /leagues
GET /leagues/:id
GET /leagues/:id/standings
GET /leagues/search?country=:country
```

### Matches Endpoints

```http
GET /matches
GET /matches/live
GET /matches/:id
GET /matches/:id/statistics
GET /matches/search?team=:teamName
```

### Teams Endpoints

```http
GET /teams
GET /teams/:id
GET /teams/:id/squad
GET /teams/search?name=:teamName
```

## Authentication 🔐

The API uses JWT for authentication. To access protected endpoints:

1. Register or login to get a JWT token
2. Include the token in the Authorization header:
```http
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
- `500`: Internal Server Error

Error responses follow this format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

## Rate Limiting 🚦

The API implements rate limiting to prevent abuse:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

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
- `leagues`: League information and standings
- `matches`: Match data and statistics
- `teams`: Team information and squad details

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

## License 📝

This project is [MIT licensed](LICENSE).
