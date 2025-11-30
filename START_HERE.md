# ⚡ START HERE - First Time Setup

## 🎯 Goal
Get your E-Waste Blockchain Tracker running in **15 minutes**!

---

## ✅ What You Already Have
- Ganache installed
- MetaMask account created
- .env files saved

---

## 🚀 Let's Start!

### 1️⃣ OPEN GANACHE (30 seconds)

**Do this:**
1. Open Ganache app
2. Click "Quickstart Ethereum"
3. Click the 🔑 key icon next to Account (0)
4. Copy the private key
5. Keep Ganache open!

**✅ Success:** Ganache shows "RPC SERVER http://127.0.0.1:7545"

---

### 2️⃣ CONNECT METAMASK TO GANACHE (2 minutes)

**Add Network:**
1. Open MetaMask → Click network dropdown (top)
2. Click "Add network" → "Add a network manually"
3. Enter EXACTLY:
   - Network name: `Ganache Local`
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337`
   - Currency symbol: `ETH`
4. Click "Save"

**Import Account:**
1. MetaMask → Click your account icon → "Import Account"
2. Paste the private key from Ganache
3. Click "Import"
4. You should see ~100 ETH!

**✅ Success:** MetaMask shows "Ganache Local" network and 100 ETH balance

---

### 3️⃣ INSTALL EVERYTHING (3 minutes)

**Copy this entire block and paste in terminal:**

```bash
# Install blockchain
cd C:\Users\Dhana\Desktop\blockchain\blockchain
npm install

# Install backend
cd C:\Users\Dhana\Desktop\blockchain\backend
npm install

# Install frontend
cd C:\Users\Dhana\Desktop\blockchain\frontend
npm install
```

**✅ Success:** No error messages, all installed successfully

---

### 4️⃣ DEPLOY SMART CONTRACT (2 minutes)

**Copy and paste:**

```bash
cd C:\Users\Dhana\Desktop\blockchain\blockchain
npx truffle migrate --reset
npm run export-abi
```

**IMPORTANT:** You'll see output like this:
```
EWasteTracking: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**📋 COPY that 0x... address!**

---

### 5️⃣ ADD CONTRACT ADDRESS TO FRONTEND (1 minute)

1. Open: `C:\Users\Dhana\Desktop\blockchain\frontend\.env`
2. Find: `REACT_APP_CONTRACT_ADDRESS=`
3. Paste your address: `REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3`
4. **SAVE** the file

---

### 6️⃣ START ALL SERVERS (3 minutes)

**You need 3 terminals. Open them and run ONE command in EACH:**

**🖥️ Terminal 1 - MongoDB:**
```bash
mongod
```
*Keep it running! You'll see "Waiting for connections"*

**🖥️ Terminal 2 - Backend:**
```bash
cd C:\Users\Dhana\Desktop\blockchain\backend
npm run dev
```
*Keep it running! You'll see "Server running on port 5000"*

**🖥️ Terminal 3 - Frontend:**
```bash
cd C:\Users\Dhana\Desktop\blockchain\frontend
npm start
```
*Browser will open automatically to http://localhost:3000*

**✅ Success:** Browser shows the Login page

---

## 🎮 NOW USE THE APP!

### Create Your First Account

1. Browser should be at http://localhost:3000
2. Click **"Register"**
3. Fill in:
   ```
   Name: Test Manufacturer
   Email: test@test.com
   Role: Manufacturer
   Password: password123
   Confirm: password123
   ```
4. Click **"Register"**
5. You're in! 🎉

---

### Connect Your Wallet

1. Click **"Connect MetaMask"** button
2. MetaMask popup → Click **"Next"** → **"Connect"**
3. ✅ You'll see "Connected Account: 0x..."

---

### Register Your First Device

1. Click **"Register New Device"**
2. Fill in:
   ```
   Device Name: iPhone 14
   Manufacturer: Apple Inc.
   Category: Smartphone
   Model: iPhone14
   Serial Number: TEST123
   Weight: 200
   Wallet Address: (paste your MetaMask address)
   ```
3. Click **"Submit"**
4. **MetaMask popup** → Click **"Confirm"**
5. Wait 3 seconds...
6. ✅ **DEVICE REGISTERED ON BLOCKCHAIN!**

---

## 🎯 VERIFY IT WORKED

**Check Ganache:**
1. Go to Ganache app
2. Click "Transactions" tab
3. You'll see your transaction! ✅

**Check Website:**
1. Go to Dashboard
2. You'll see "Total Devices: 1" ✅

---

## ❌ PROBLEMS?

### "Contract address not found"
- Did you copy the 0x... address from step 4?
- Did you paste it in frontend/.env?
- Did you SAVE the file?
- Restart Terminal 3 (frontend)

### "Network Error"
- Is Terminal 2 running? (backend)
- Do you see "Server running on port 5000"?

### "MongoDB connection failed"
- Is Terminal 1 running? (mongod)
- Do you see "Waiting for connections"?

### MetaMask transaction fails
- Are you on "Ganache Local" network?
- Do you have ~100 ETH?
- Try: MetaMask → Settings → Advanced → Reset Account

---

## 🎉 SUCCESS!

**You now have:**
- ✅ Working blockchain system
- ✅ Device registered on blockchain
- ✅ MetaMask connected
- ✅ All servers running

---

## 📚 Next Steps

1. **Register more devices** - Try it!
2. **Create other user types** - Logout, register as Consumer/Recycler/Regulator
3. **Explore the code** - See how it works
4. **Read SIMPLE_WORKFLOW.md** - Detailed guide

---

## 🆘 Still Stuck?

Read these in order:
1. **SIMPLE_WORKFLOW.md** - Step-by-step workflows
2. **README.md** - Complete documentation
3. **IMPLEMENTATION_STATUS.md** - What's built, what's next

---

**You're all set! Have fun building! 🚀**
