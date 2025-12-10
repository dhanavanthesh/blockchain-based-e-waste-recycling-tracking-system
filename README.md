# E-Waste Recycling Blockchain Tracking System

A full-stack blockchain-enabled application for tracking electronic waste from production to recycling. Features 4 user roles (Manufacturer, Consumer, Recycler, Regulator) with real-time updates and MetaMask integration.

## Tech Stack

- **Frontend**: React.js + Material-UI + Socket.io client + ethers.js
- **Backend**: Node.js + Express.js + Socket.io + JWT auth
- **Database**: MongoDB
- **Blockchain**: Ganache (local Ethereum) + Solidity
- **Testing**: Jest (backend) + React Testing Library (frontend) + Truffle tests

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) - Must be running on localhost:27017
- [MetaMask](https://metamask.io/) browser extension

## Quick Start

### 1. Install Dependencies

```bash
npm run install-all
```

This installs all dependencies for blockchain, backend, and frontend.

### 2. Start MongoDB

Make sure MongoDB is running on port 27017:

**Windows:**
```bash
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 3. Start Everything

```bash
npm start
```

That's it! This single command will:
- Start Ganache blockchain on port 7545
- Automatically deploy smart contracts
- Update all configuration files
- Start backend server on port 5000
- Start frontend on port 3000

The application will open at http://localhost:3000

### 4. Setup MetaMask (First Time Only)

1. Install MetaMask browser extension
2. Add Ganache network to MetaMask:
   - **Network Name**: Ganache Local
   - **RPC URL**: http://127.0.0.1:7545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH

3. Import a Ganache account:
   - In MetaMask: Account menu → Import Account
   - Ganache deterministic account private keys:
     - Account 0: `0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d`
     - Account 1: `0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1`

### 5. Register and Use

1. Go to http://localhost:3000
2. Click "Register" and create an account (choose your role)
3. Login with your credentials
4. Connect your MetaMask wallet when prompted
5. Start using the application!

## Project Structure

```
ewaste-tracking/
├── blockchain/         # Smart contracts and Truffle config
│   ├── contracts/      # Solidity smart contracts
│   ├── migrations/     # Deployment scripts
│   └── scripts/        # Helper scripts
├── backend/           # Express.js API server
│   ├── config/        # Configuration files
│   ├── controllers/   # Route controllers
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   └── services/      # Business logic & blockchain interaction
├── frontend/          # React.js application
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── contexts/   # React contexts (Auth, Web3)
│   │   ├── pages/      # Page components by role
│   │   └── utils/      # Helper functions
└── scripts/           # Startup/stop scripts
```

## User Roles

1. **Manufacturer** - Register new devices on the blockchain
2. **Consumer** - Claim device ownership and dispose to recyclers
3. **Recycler** - Receive devices and submit recycling reports
4. **Regulator** - Verify recycling reports and monitor the system

## Key Features

- **Blockchain Integration**: All device lifecycle events recorded on Ethereum
- **Wallet-Based Authentication**: MetaMask integration for secure transactions
- **Real-time Updates**: Socket.io for live notifications
- **QR Code Generation**: Unique QR codes for each device
- **Role-Based Access Control**: Separate dashboards for each user type
- **Auto-Deployment**: Smart contracts deploy automatically on first run
- **Simplified Setup**: Single command to start entire application

## Development

### Running Individual Services

If you need to run services separately:

```bash
# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm start

# Blockchain only
cd blockchain && npx ganache --port 7545 --deterministic
```

### Stopping All Services

```bash
npm stop
```

Or press `Ctrl+C` in the terminal where `npm start` is running.

### Redeploying Contracts

The backend automatically deploys contracts if they're not found. To force redeployment:

```bash
cd blockchain
truffle migrate --reset
```

The backend will detect the new contract address and update configs automatically on next start.

### Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Smart contract tests
cd blockchain && truffle test
```

## API Endpoints

- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/link-wallet`
- **Manufacturer**: `/api/manufacturer/device`, `/api/manufacturer/devices`
- **Consumer**: `/api/consumer/devices`, `/api/consumer/device/claim`
- **Recycler**: `/api/recycler/devices`, `/api/recycler/report`
- **Regulator**: `/api/regulator/reports`, `/api/regulator/verify`

## Troubleshooting

### MongoDB Connection Error
Make sure MongoDB is running:
```bash
# Check if MongoDB is running
# Windows: services.msc (look for MongoDB)
# Mac: brew services list
# Linux: systemctl status mongod
```

### Ganache Port Already in Use
Stop the existing Ganache instance or change the port in `.env` files.

### Contract Deployment Failed
1. Make sure Ganache is running
2. Delete `blockchain/build` folder
3. Restart the application with `npm start`

### MetaMask Transaction Errors
1. Make sure you're on the Ganache network in MetaMask
2. Try resetting your account in MetaMask (Settings → Advanced → Reset Account)

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
