# Portfolio Backend Server

Express API backend supporting contact form transmissions, optional newsletter subscriptions, and administrative authentication.

## Getting Started

1. **Install dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your credentials:
   ```env
   PORT=3001
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=portfolio
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

3. **Start the Server**:
   ```bash
   npm start
   # or for auto-reload:
   npm run dev
   ```

## Standalone & Production Ready
The server automatically falls back to standalone mode if MySQL is not running, ensuring API requests receive valid `{ success: true }` responses.
