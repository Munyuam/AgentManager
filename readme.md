# Agent Manager System

A simple Node.js + MySQL app for recording daily agent mobile money transactions.

## Features
- Add opening balances
- Add closing balances
- Auto-generate transaction IDs
- Update profile (username & phone number)
- Basic reporting views

## Tech Used
- Node.js (Express)
- MySQL
- EJS templates

## Setup
1. Install dependencies:
```
npm install
```
2. Create a `.env` file:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=agentmanager
SESSION_SECRET=secret
```
3. Run the server:
```
npm start
```

## Important Routes
- **POST /dailyTransactions** → add cash-in or cash-out
- **POST /updateProfile** → update user info

## Basic Folder Structure
```
services/        # Logic for transactions & profile update
routes/          # All routes
views/           # EJS UI
public/          # CSS & JS
app.js           # App entry
```
