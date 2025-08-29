# Social Wallet

Social Wallet is a full-stack application that lets users and businesses manage digital cards and social connections. The project is split into a Node.js/Express API and a React frontend.

## Project Structure
- **backEnd/** – REST API built with Express, Sequelize and MySQL.
- **frontEnd/** – React client bootstrapped with Create React App and Material‑UI.

## Features
- User and business registration with password or Google OAuth.
- JWT authentication stored in secure cookies.
- Encrypted user data in local storage on the client.
- Manage social connections between users.
- Business wallet for storing and sharing cards.

## Prerequisites
- Node.js 18+
- npm
- MySQL database

## Backend Setup
```bash
cd backEnd
npm install
# configure config/*.json with database credentials and secrets
npx sequelize-cli db:migrate
npm start
```

## Frontend Setup
```bash
cd frontEnd
npm install
# create .env with REACT_APP_BACKEND_URL, REACT_APP_CRYPTO_KEY and REACT_APP_CRYPTO_IV
npm start
```

## Tests
- Backend: `npm test` (placeholder script).
- Frontend: `npm test` (requires dependencies).

## License
ISC
