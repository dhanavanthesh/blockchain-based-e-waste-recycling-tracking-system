# SIMPLE WORKFLOW GUIDE - E-WASTE TRACKER

## 🎯 YOU HAVE DONE:
✅ Installed Ganache
✅ Created MetaMask account
✅ .env files saved

---

## 📋 COMPLETE SETUP (Follow Step by Step)

### STEP 1: Start Ganache (1 minute)

1. **Open Ganache application**
2. Click **"Quickstart Ethereum"**
3. You'll see 10 accounts with 100 ETH each
4. **COPY 2-3 Private Keys** (click the key icon next to accounts)
   - Keep these safe, you'll need them!

**✅ CHECK: Ganache shows "RPC SERVER" running on HTTP://127.0.0.1:7545**

---

### STEP 2: Setup MetaMask (3 minutes)

1. **Open MetaMask extension** in your browser

2. **Add Ganache Network:**
   - Click MetaMask → Networks (top) → Add Network → Add network manually
   - Fill in:
     ```
     Network Name: Ganache Local
     RPC URL: http://127.0.0.1:7545
     Chain ID: 1337
     Currency Symbol: ETH
     ```
   - Click **Save**

3. **Import Ganache Account:**
   - In MetaMask → Click account icon → Import Account
   - Paste the **Private Key** you copied from Ganache
   - Click **Import**
   - **Repeat 2-3 times** with different accounts

**✅ CHECK: MetaMask shows "Ganache Local" network and imported accounts with ~100 ETH**

---

### STEP 3: Start MongoDB (1 minute)

**Open a NEW terminal (Terminal 1):**

```bash
# Start MongoDB
mongod
```

**Keep this terminal open!**

**✅ CHECK: Terminal shows "Waiting for connections" message**

---

### STEP 4: Install & Deploy Smart Contract (3 minutes)

**Open a NEW terminal (Terminal 2):**

```bash
# Navigate to blockchain folder
cd C:\Users\Dhana\Desktop\blockchain\blockchain

# Install dependencies
npm install

# Compile smart contract
npx truffle compile

# Deploy to Ganache
npx truffle migrate --reset
```

**IMPORTANT:** After deployment, you'll see output like:
```
EWasteTracking: 0xABCD1234... (some long address)
```

**COPY THIS CONTRACT ADDRESS!**

```bash
# Export ABI to backend
npm run export-abi
```

**✅ CHECK: You see "✅ ABI and contract address exported successfully!"**

---

### STEP 5: Update Frontend .env with Contract Address (1 minute)

1. Open file: `C:\Users\Dhana\Desktop\blockchain\frontend\.env`
2. Find line: `REACT_APP_CONTRACT_ADDRESS=`
3. Paste your contract address after the `=`
4. Should look like: `REACT_APP_CONTRACT_ADDRESS=0xABCD1234...`
5. **SAVE the file**

---

### STEP 6: Start Backend Server (2 minutes)

**Open a NEW terminal (Terminal 3):**

```bash
# Navigate to backend
cd C:\Users\Dhana\Desktop\blockchain\backend

# Install dependencies
npm install

# Start server
npm run dev
```

**✅ CHECK: You see:**
```
✅ MongoDB Connected: localhost
✅ Web3 initialized successfully
✅ Server running on port 5000
✅ Blockchain event listeners setup complete
```

**Keep this terminal open!**

---

### STEP 7: Start Frontend (2 minutes)

**Open a NEW terminal (Terminal 4):**

```bash
# Navigate to frontend
cd C:\Users\Dhana\Desktop\blockchain\frontend

# Install dependencies
npm install

# Start React app
npm start
```

Browser will automatically open to **http://localhost:3000**

**✅ CHECK: You see the Login/Register page**

---

## 🎮 HOW TO USE THE SYSTEM

### WORKFLOW 1: Register as Manufacturer

1. **On the website** (http://localhost:3000)
2. Click **"Register"**
3. Fill in:
   - Name: `John Manufacturer`
   - Email: `john@manufacturer.com`
   - Role: **Manufacturer** (select from dropdown)
   - Password: `password123`
   - Confirm Password: `password123`
4. Click **"Register"**
5. You'll be logged in automatically!

---

### WORKFLOW 2: Connect MetaMask

1. After login, you'll see **"Connect MetaMask"** button
2. Click it
3. **MetaMask will popup** → Click **"Next"** → Click **"Connect"**
4. You'll see: "Connected Account: 0x..."

**✅ NOW YOU'RE READY TO USE BLOCKCHAIN!**

---

### WORKFLOW 3: Register a Device on Blockchain

1. Click **"Register New Device"** button
2. Fill in device details:
   ```
   Device Name: iPhone 13
   Manufacturer: Apple Inc.
   Category: Smartphone
   Model: iPhone13
   Serial Number: APPLE123456
   Weight: 174
   ```
3. **Wallet Address**: Copy your MetaMask account address
   - Open MetaMask → Click account name → Address copied!
4. Click **"Submit"** or **"Register"**
5. **MetaMask will popup** → Click **"Confirm"** to approve transaction
6. Wait for confirmation (~3 seconds)
7. **Device registered!** ✅

---

### WORKFLOW 4: View Device in Ganache

1. Go to **Ganache application**
2. Click **"Transactions"** tab
3. You'll see your device registration transaction!
4. Click **"Blocks"** to see it recorded on blockchain

---

## 🔍 WHAT'S HAPPENING?

### The Flow:
```
1. User registers on website
   ↓
2. User connects MetaMask wallet
   ↓
3. User creates a device
   ↓
4. Frontend sends transaction to MetaMask
   ↓
5. MetaMask sends to Ganache blockchain
   ↓
6. Smart contract stores device data
   ↓
7. Backend saves additional info to MongoDB
   ↓
8. QR code generated for device
   ↓
9. Real-time update sent to all users via Socket.io
```

---

## 📱 TESTING THE COMPLETE SYSTEM

### Test 1: Create Multiple Devices
1. Register 3-4 devices
2. Each time, approve MetaMask transaction
3. View all devices in your dashboard

### Test 2: Create Different User Types
1. Logout
2. Register new user as **Consumer**
3. Login and see Consumer dashboard
4. Repeat for **Recycler** and **Regulator**

---

## 🚨 TROUBLESHOOTING

### Problem: MetaMask transaction fails
**Solution:**
- Make sure you're on "Ganache Local" network in MetaMask
- Check account has ETH (should show ~100 ETH)
- Click MetaMask → Settings → Advanced → Reset Account

### Problem: "Contract address not found"
**Solution:**
- Make sure you deployed smart contract (Step 4)
- Copy contract address from terminal
- Paste in `frontend\.env` file
- Restart frontend server

### Problem: Backend won't connect to MongoDB
**Solution:**
- Check Terminal 1 - MongoDB should be running
- If not, open new terminal and run `mongod`

### Problem: "Network Error" in website
**Solution:**
- Check Terminal 3 - Backend should be running
- Should see "Server running on port 5000"
- If not, restart backend

---

## 📊 YOUR TERMINAL SETUP

You should have **4 terminals open:**

| Terminal | Running | Command |
|----------|---------|---------|
| Terminal 1 | MongoDB | `mongod` |
| Terminal 2 | *(Can close after deploy)* | Blockchain deployment |
| Terminal 3 | Backend Server | `npm run dev` |
| Terminal 4 | Frontend React | `npm start` |

---

## ✅ SUCCESS CHECKLIST

Before testing, verify all these:
- [ ] Ganache running (RPC Server: 127.0.0.1:7545)
- [ ] MetaMask has Ganache network added
- [ ] MetaMask has imported accounts with ~100 ETH
- [ ] MongoDB running (Terminal 1)
- [ ] Smart contract deployed (contract address copied)
- [ ] Backend running (Terminal 3 - port 5000)
- [ ] Frontend running (Terminal 4 - opens browser)
- [ ] Contract address in frontend/.env file

---

## 🎯 QUICK COMMANDS REFERENCE

```bash
# Start MongoDB (Terminal 1)
mongod

# Deploy Smart Contract (Terminal 2)
cd C:\Users\Dhana\Desktop\blockchain\blockchain
npx truffle migrate --reset
npm run export-abi

# Start Backend (Terminal 3)
cd C:\Users\Dhana\Desktop\blockchain\backend
npm run dev

# Start Frontend (Terminal 4)
cd C:\Users\Dhana\Desktop\blockchain\frontend
npm start
```

---

## 🎉 YOU'RE DONE!

Now you have a working E-Waste Tracking System with:
- ✅ Blockchain-based device registration
- ✅ MetaMask wallet integration
- ✅ Real-time updates
- ✅ Multiple user roles
- ✅ Secure authentication

**Next Steps:**
- Test registering multiple devices
- Create users for other roles (Consumer, Recycler, Regulator)
- Explore the code to understand how it works
- Add more features as needed!

---

Need help? Check the main **README.md** for detailed documentation!
