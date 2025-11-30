# Quick Start Guide

Get the E-Waste Tracking System running in 15 minutes!

## Prerequisites Check

Make sure you have these installed:
- [ ] Node.js (v16+)
- [ ] MongoDB
- [ ] Ganache
- [ ] MetaMask browser extension
- [ ] Truffle (`npm install -g truffle`)

## Installation Steps

### 1. Install All Dependencies (2 minutes)

```bash
# Install blockchain dependencies
cd blockchain
npm install

# Install backend dependencies
cd ../backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Start Ganache (1 minute)

```bash
# Option 1: GUI
# Open Ganache application and create new workspace

# Option 2: CLI
ganache-cli -p 7545 -d
```

**Important**: Copy 2-3 private keys from Ganache for later use.

### 3. Start MongoDB (1 minute)

```bash
# Start MongoDB service
mongod

# Or start as background service
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: net start MongoDB
```

### 4. Deploy Smart Contract (2 minutes)

```bash
cd blockchain

# Compile and deploy
truffle migrate --reset

# Export ABI
npm run export-abi
```

**Note the contract address** printed in the output!

### 5. Configure Environment (3 minutes)

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ewaste_tracking
JWT_SECRET=your_random_secret_key_here
BLOCKCHAIN_URL=http://127.0.0.1:7545
NODE_ENV=development
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_BLOCKCHAIN_URL=http://127.0.0.1:7545
REACT_APP_CONTRACT_ADDRESS=<paste_contract_address_here>
```

### 6. Setup MetaMask (2 minutes)

1. Open MetaMask
2. Add custom network:
   - Network Name: **Ganache Local**
   - RPC URL: **http://127.0.0.1:7545**
   - Chain ID: **1337**
   - Currency Symbol: **ETH**

3. Import account:
   - Click "Import Account"
   - Paste a private key from Ganache
   - Repeat for 2-3 accounts

### 7. Start the Application (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Application will open at **http://localhost:3000**

## First Use (5 minutes)

### 1. Register a Manufacturer
1. Go to http://localhost:3000/register
2. Fill in details:
   - Name: John Doe
   - Email: manufacturer@test.com
   - Password: password123
   - Role: Manufacturer
3. Click Register

### 2. Connect MetaMask
1. After login, click "Connect MetaMask"
2. Select your imported Ganache account
3. Approve the connection

### 3. Register a Device
1. Click "Register New Device"
2. Fill in device details
3. Approve MetaMask transaction
4. Wait for confirmation
5. Device registered!

## Verify Everything Works

✅ Backend running on port 5000
✅ Frontend running on port 3000
✅ MongoDB connected
✅ Ganache blockchain running
✅ MetaMask connected
✅ Smart contract deployed
✅ Can register and login
✅ Can connect MetaMask
✅ Can register a device

## Troubleshooting

### Can't connect to MongoDB
```bash
# Check if MongoDB is running
mongosh

# If not installed correctly, download from:
# https://www.mongodb.com/try/download/community
```

### MetaMask transaction fails
- Ensure you're on Ganache network
- Check account has ETH
- Verify contract address in frontend .env
- Reset MetaMask account (Settings → Advanced → Reset Account)

### Backend won't start
- Check MongoDB is running
- Verify .env file exists
- Check port 5000 is not in use
- Run `npm install` again

### Contract deployment fails
- Ensure Ganache is running on port 7545
- Delete `blockchain/build` folder
- Run `truffle compile` then `truffle migrate --reset`

## What's Next?

Now that the basic system is running:

1. **Test the manufacturer workflow**
   - Register multiple devices
   - View device list
   - Check blockchain transactions in Ganache

2. **Create other user types**
   - Register as Consumer, Recycler, Regulator
   - Test their dashboards (currently placeholders)

3. **Implement remaining features**
   - See IMPLEMENTATION_STATUS.md for details
   - Follow patterns from manufacturer module

4. **Explore the code**
   - Smart contract: `blockchain/contracts/EWasteTracking.sol`
   - Backend API: `backend/server.js`
   - Frontend: `frontend/src/App.jsx`

## Need Help?

1. Check the main README.md for detailed documentation
2. Review IMPLEMENTATION_STATUS.md for what's completed
3. Look at the code comments for guidance
4. Test smart contract functions in Truffle console:
   ```bash
   cd blockchain
   truffle console
   ```

## Sample Test Credentials

Feel free to create these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Manufacturer | mfg@test.com | password123 |
| Consumer | consumer@test.com | password123 |
| Recycler | recycler@test.com | password123 |
| Regulator | regulator@test.com | password123 |

**Security Note**: Never use simple passwords in production!

---

Congratulations! Your E-Waste Tracking System is now running. 🎉
