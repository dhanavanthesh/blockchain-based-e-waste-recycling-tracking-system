# E-Waste Recycling Blockchain Tracking System

A full-stack blockchain-enabled application for tracking electronic waste from production to recycling. Features 4 user roles (Manufacturer, Consumer, Recycler, Regulator) with real-time updates and MetaMask integration.

## Tech Stack

- **Frontend**: React.js + Material-UI + Socket.io client + ethers.js
- **Backend**: Node.js + Express.js + Socket.io + JWT auth
- **Database**: MongoDB
- **Blockchain**: Ganache (local Ethereum) + Solidity
- **Testing**: Jest (backend) + React Testing Library (frontend) + Truffle tests

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v5 or higher)
- [Ganache](https://trufflesuite.com/ganache/) (for local Ethereum blockchain)
- [MetaMask](https://metamask.io/) browser extension
- [Truffle](https://trufflesuite.com/truffle/) (`npm install -g truffle`)

## Project Structure

```
ewaste-tracking/
├── blockchain/         # Smart contracts and migrations
├── backend/           # Express.js API server
└── frontend/          # React.js application
```

## Setup Instructions

### Step 1: Clone and Install Dependencies

```bash
# Navigate to the blockchain project directory
cd blockchain

# Install blockchain dependencies
npm install

# Navigate to backend
cd ../backend
npm install

# Navigate to frontend
cd ../frontend
npm install
```

### Step 2: Start Ganache

1. Open Ganache GUI or run:
```bash
ganache-cli -p 7545 -d
```

2. Ganache will start on `http://127.0.0.1:7545`
3. Note down some account addresses and private keys for testing

### Step 3: Deploy Smart Contracts

```bash
cd blockchain

# Compile contracts
truffle compile

# Deploy to Ganache
truffle migrate --reset --network development

# Run tests (optional but recommended)
truffle test

# Export ABI to backend
npm run export-abi
```

After deployment, you'll see the contract address in the output. Note this down.

### Step 4: Configure MetaMask

1. Open MetaMask extension
2. Add new network with these details:
   - **Network Name**: Ganache Local
   - **RPC URL**: http://127.0.0.1:7545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH

3. Import accounts from Ganache:
   - Copy private keys from Ganache
   - In MetaMask: Account menu → Import Account → Paste private key

### Step 5: Setup Backend

```bash
cd backend

# Copy environment template
cp .env.example .env
```

Edit `.env` and update:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ewaste_tracking
JWT_SECRET=your_super_secret_key_here
BLOCKCHAIN_URL=http://127.0.0.1:7545
NODE_ENV=development
```

**Important**: The `CONTRACT_ADDRESS` will be automatically set when you run the export-abi script from Step 3.

### Step 6: Start MongoDB

```bash
# Start MongoDB service
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac
```

### Step 7: Setup Frontend

```bash
cd frontend

# Copy environment template
cp .env.example .env
```

Edit `.env` and update:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_BLOCKCHAIN_URL=http://127.0.0.1:7545
REACT_APP_CONTRACT_ADDRESS=<your_deployed_contract_address>
```

You also need to create a config file for the contract ABI:
```bash
mkdir -p frontend/src/config
```

The contract ABI will be automatically copied when you run the export-abi script.

### Step 8: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend runs on http://localhost:3000

## Usage Guide

### 1. Register Users

1. Navigate to http://localhost:3000/register
2. Create accounts for different roles:
   - Manufacturer
   - Consumer
   - Recycler
   - Regulator

### 2. Connect MetaMask

1. After logging in, click "Connect MetaMask"
2. Approve the connection request
3. Your wallet address will be displayed

### 3. Register User on Blockchain (Optional)

Some operations require your account to be registered on the blockchain. The app will prompt you when needed.

### 4. Manufacturer Workflow

1. Login as Manufacturer
2. Go to Dashboard
3. Click "Register New Device"
4. Fill in device details
5. Approve MetaMask transaction
6. Device is registered on blockchain and database
7. QR code is generated for the device

### 5. Consumer Workflow

1. Login as Consumer
2. Scan QR code to view device history
3. View device ownership timeline from blockchain
4. Request ownership transfer

### 6. Recycler Workflow

1. Login as Recycler
2. Scan device to collect
3. Update device status (Collected/Destroyed/Recycled)
4. Submit recycling report with photos
5. Report is recorded on blockchain

### 7. Regulator Workflow

1. Login as Regulator
2. Monitor all devices in system
3. View pending recycling reports
4. Verify reports (blockchain transaction)
5. Generate compliance reports

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/link-wallet` - Link MetaMask wallet

### Manufacturer
- `POST /api/manufacturer/device` - Register device
- `GET /api/manufacturer/devices` - List devices
- `GET /api/manufacturer/device/:id` - Device details
- `GET /api/manufacturer/statistics` - Dashboard stats

## Smart Contract Functions

### User Management
- `registerUser(Role _role)` - Register on blockchain
- `getUserRole(address)` - Get user's role
- `isUserRegistered(address)` - Check if registered

### Device Management
- `registerDevice(name, manufacturer)` - Register new device
- `transferOwnership(deviceId, newOwner)` - Transfer device
- `updateDeviceStatus(deviceId, status)` - Update status (Recycler)
- `getDevice(deviceId)` - Get device details
- `getDeviceHistory(deviceId)` - Get ownership history

### Recycling
- `submitRecyclingReport(deviceId, weight, components)` - Submit report
- `verifyReport(reportId)` - Verify report (Regulator)
- `getRecyclingReport(reportId)` - Get report details

## Testing

### Smart Contract Tests
```bash
cd blockchain
truffle test
```

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Troubleshooting

### MetaMask Connection Issues
- Ensure Ganache is running on port 7545
- Check MetaMask network is set to Ganache Local
- Clear MetaMask activity data and reconnect

### Blockchain Transaction Failures
- Check account has enough ETH for gas
- Verify correct contract address in .env files
- Ensure user is registered on blockchain with correct role

### MongoDB Connection Errors
- Verify MongoDB is running: `mongosh`
- Check MONGO_URI in backend/.env
- Ensure database permissions are correct

### Socket.io Not Connecting
- Check CORS settings in server.js
- Verify SOCKET_URL in frontend/.env
- Check browser console for connection errors

## Real-time Features

The app uses Socket.io for real-time updates:

- **device:registered** - New device added
- **device:transferred** - Ownership changed
- **device:statusUpdated** - Status updated
- **report:submitted** - New recycling report
- **report:verified** - Report verified

## Security Notes

- Store JWT_SECRET securely in production
- Use HTTPS in production
- Validate all inputs on frontend and backend
- Implement rate limiting for API endpoints
- Use environment-specific contract addresses

## Future Enhancements

- Add Consumer, Recycler, and Regulator module pages
- Implement QR code scanning
- Add charts and analytics
- Email notifications
- PDF report generation
- Deploy to Ethereum testnet
- Mobile app with React Native
- IPFS integration for images
- Token rewards for recycling

## Architecture Overview

### Blockchain Layer
- Solidity smart contract handles all immutable operations
- Events emitted for every state change
- Role-based access control on-chain

### Backend Layer
- Express.js API for off-chain data
- MongoDB stores metadata (specs, images)
- Web3 service bridges blockchain and API
- Socket.io broadcasts real-time updates

### Frontend Layer
- React with Material-UI for user interface
- Three context providers:
  - AuthContext: JWT authentication
  - Web3Context: MetaMask connection
  - SocketContext: Real-time updates
- Role-based routing and components

## License

MIT

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review smart contract events in Ganache
3. Check browser console for errors
4. Verify all environment variables are set

## Development Team

Built with Claude Code - AI-powered development assistant

## Acknowledgments

- Truffle Suite for blockchain development tools
- Material-UI for React components
- ethers.js for Ethereum interactions
- Socket.io for real-time communication
