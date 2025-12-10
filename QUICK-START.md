# Quick Start Guide

This guide shows you how to run the E-Waste Tracking application with separate commands for each component.

## Prerequisites

1. **Ganache** must be running on `http://127.0.0.1:7545`
2. **MongoDB** must be running on `mongodb://localhost:27017`
3. All dependencies installed: `npm run install-all` (run once from root)

## Running the Application

### 1. Deploy Blockchain Contracts (Do this first!)

```bash
cd blockchain
npm run deploy
```

This will:
- ✅ Compile and deploy smart contracts
- ✅ Automatically update `backend/.env` with contract address
- ✅ Automatically update `frontend/.env` with contract address
- ✅ Copy the contract ABI to frontend

**Note:** Run this whenever you restart Ganache or need to redeploy contracts.

### 2. Start Backend Server

Open a new terminal:

```bash
cd backend
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Start Frontend Application

Open another new terminal:

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:3000`

## Summary

You'll have 3 terminals running:

1. **Terminal 1:** Ganache (blockchain)
2. **Terminal 2:** `cd backend && npm run dev` (API server)
3. **Terminal 3:** `cd frontend && npm run dev` (React app)

## Troubleshooting

**Contract address mismatch?**
- Stop backend and frontend
- Redeploy: `cd blockchain && npm run deploy`
- Restart backend and frontend

**Port already in use?**
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port when prompted by React

**Connection refused?**
- Check Ganache is running on port 7545
- Check MongoDB is running
- Verify all .env files have correct values

## Development Workflow

1. Make changes to smart contracts → `cd blockchain && npm run deploy`
2. Make changes to backend → Auto-reloads with nodemon
3. Make changes to frontend → Auto-reloads with React
