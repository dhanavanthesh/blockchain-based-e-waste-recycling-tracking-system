# Consumer Complete Step-by-Step Procedure
## E-Waste Blockchain Tracking System

---

## **Login Credentials**
```
Email: consumer@gmail.com
Password: 123456
```

---

## **Prerequisites**
Before starting, ensure you have:
- ✅ MetaMask browser extension installed
- ✅ Ganache blockchain running on `http://127.0.0.1:7545`
- ✅ Backend server running on port 5000
- ✅ Frontend application running
- ✅ At least one device registered by a manufacturer (for testing)

---

## **Complete Consumer Workflow**

### **STEP 1: Login to the System**

1. Open your web browser and navigate to the application
2. Go to the login page (`/login`)
3. Enter credentials:
   - **Email**: `consumer@gmail.com`
   - **Password**: `123456`
4. Click **"Login"** button
5. **✅ Success**: You will be redirected to `/consumer/dashboard`

**What you should see**: Consumer Dashboard with statistics cards and quick action buttons

---

### **STEP 2: Connect MetaMask Wallet**

**Why?** MetaMask is required to interact with the blockchain for claiming and recycling devices.

1. On the dashboard, you'll see a **yellow warning alert** saying "MetaMask Not Connected"
2. Click the **"Connect Now"** button in the alert
3. MetaMask popup will appear
4. Select the account you want to connect
5. Click **"Connect"** in MetaMask
6. **✅ Success**: Alert turns green showing your connected wallet address

**What you should see**:
```
✅ Wallet Connected: 0x1234...5678
```

**Troubleshooting**:
- If MetaMask doesn't popup: Check if extension is installed
- If connection fails: Refresh the page and try again
- Make sure you're on the correct network (Ganache local network)

---

### **STEP 3: Register Wallet (First Time Only)**

**Important**: This step is only needed the first time you connect a wallet.

1. After connecting MetaMask, navigate to **"Register Wallet"** page
2. You'll see a 3-step stepper:
   - ✅ Step 1: Connect MetaMask (already done)
   - 🔄 Step 2: Register on Blockchain
   - ⏳ Step 3: Link Wallet to Account

3. Click **"Register on Blockchain"** button
4. MetaMask will popup asking to confirm transaction
5. Click **"Confirm"** in MetaMask
6. Wait for blockchain confirmation (5-10 seconds)
7. System will automatically link wallet to your account
8. **✅ Success**: You'll see "Registration Complete!"

**What this does**:
- Registers your wallet address on the blockchain as a Consumer
- Links your wallet to your consumer@gmail.com account
- Enables you to claim and manage devices

---

### **STEP 4: View Dashboard Statistics**

Your dashboard shows real-time statistics:

**Statistics Cards**:
1. **Owned Devices** (Purple gradient card)
   - Shows number of devices you currently own
   - Count: Currently active devices

2. **Recycled Devices** (Pink gradient card)
   - Shows total devices you've recycled
   - Environmental impact tracking

3. **Blockchain Status** (White card)
   - Shows MetaMask connection status
   - Displays "Connected" or "Disconnected"

---

### **STEP 5: Scan a Device QR Code**

**Purpose**: Verify device authenticity and view its information before claiming ownership.

1. On the dashboard, click **"Scan Device QR"** button (purple gradient button in Quick Actions)
2. QR Scanner dialog opens
3. You have two options:
   - **Option A**: Scan physical QR code using your camera
   - **Option B**: Manually enter the Blockchain ID (e.g., `1`, `2`, `3`)

4. For testing, enter a blockchain ID: `1`
5. Click **"Scan Device"** button
6. System queries the blockchain and database
7. **✅ Success**: Device details dialog appears

**What you should see**:
```
✅ This device is authentic and registered on the blockchain!

Device Model: iPhone 13 Pro
Serial Number: SN123456789
Blockchain ID: #1
Manufacturer: Apple Electronics
Current Owner: [Owner Name]
```

**Device History Timeline**:
- Registration by manufacturer
- All ownership transfers
- Current status
- Timestamps for each event

---

### **STEP 6: Claim Device Ownership**

**When?** After purchasing a device or receiving it from previous owner.

1. Review the device information in the dialog
2. Check the device history timeline
3. Verify device specifications match your purchase
4. Click **"Claim Ownership"** button at the bottom

**Blockchain Transaction Process**:
5. MetaMask popup appears showing transaction details
6. Review the transaction:
   - **Function**: `transferOwnership`
   - **From**: Current owner address
   - **To**: Your wallet address
   - **Gas Fee**: Will be displayed
7. Click **"Confirm"** in MetaMask
8. Wait for transaction to be mined (5-15 seconds)
9. System updates the backend database
10. **✅ Success**: "Device claimed successfully!" message appears

**What happens on blockchain**:
- Device ownership transferred to your wallet address
- Ownership history updated with timestamp
- Transaction hash recorded permanently
- Cannot be reversed or tampered with

**After claiming**:
- Device appears in "My Devices" list
- Statistics updated (Owned Devices +1)
- Device timeline shows you as new owner

---

### **STEP 7: View Your Devices**

1. From dashboard, click **"My Devices"** button (in Quick Actions)
2. Or navigate directly to `/consumer/devices`

**What you should see**:
- Grid of device cards
- Each card shows:
  - Device image/icon
  - Model name and specifications
  - Serial number
  - Current status badge
  - **"View Details"** button
  - **"Show QR Code"** button
  - **"Recycle Device"** button (orange)

**Device Card Actions**:

**A. View Details**:
1. Click **"View Details"** on any device card
2. Dialog opens showing:
   - Complete device specifications
   - Serial number
   - Blockchain ID
   - Full ownership history timeline
   - All previous owners
   - All transaction timestamps
3. Click **"Close"** when done

**B. Show QR Code**:
1. Click **"Show QR Code"** on any device card
2. QR code dialog opens displaying:
   - Printable QR code
   - Blockchain ID
   - Serial number
   - Device model
3. You can:
   - Save the QR code
   - Print for physical device labeling
   - Share with others for verification
4. Click **"Close"** when done

---

### **STEP 8: Recycle a Device**

**When?** When you want to dispose of a device responsibly through a certified recycler.

**Requirements**:
- You must own the device
- MetaMask must be connected
- You need the recycler's wallet address

**Procedure**:

1. Go to **"My Devices"** page
2. Find the device you want to recycle
3. Click **"Recycle Device"** button (orange button)
4. "Recycle Device" dialog opens

5. Enter the recycler's wallet address:
   ```
   Example: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
   ```
   **How to get recycler's address?**
   - Contact certified recycler
   - They will provide their wallet address
   - Verify it's a registered recycler in the system

6. Click **"Recycle Device"** button in dialog

**Blockchain Transaction**:
7. MetaMask popup appears
8. Review transaction:
   - **Function**: `transferOwnership`
   - **From**: Your wallet address
   - **To**: Recycler's wallet address
   - **Device**: Your device blockchain ID
   - **Gas Fee**: Displayed
9. Click **"Confirm"** in MetaMask
10. Wait for transaction confirmation
11. Backend database updated automatically
12. **✅ Success**: "Device sent for recycling successfully!"

**What happens after**:
- Device ownership transferred to recycler
- Device status changes to "in_recycling"
- Device removed from your "My Devices" list
- Device appears in "Recycled Devices" statistics
- Recycler can now process the device
- You receive blockchain-verified recycling proof

---

### **STEP 9: Track Recycling History**

1. Return to dashboard
2. Check **"Recycled Devices"** statistic (pink card)
3. Number shows total devices you've recycled
4. Click **"History"** button in Quick Actions
5. View complete lifecycle of all your devices

**History includes**:
- Devices currently owned
- Devices recycled
- All ownership transfers
- Environmental impact metrics

---

## **Dashboard Quick Actions Reference**

### **1. Scan Device QR** (Purple button)
- Opens QR scanner dialog
- Scans device blockchain ID
- Shows device information
- Allows claiming ownership

### **2. My Devices** (White outlined)
- Navigates to devices list page
- Shows all owned devices
- Access device details and QR codes

### **3. Recycle Device** (White outlined)
- Navigates to devices page
- Initiate recycling process
- Transfer to certified recyclers

### **4. History** (White outlined)
- View all device interactions
- Track ownership timeline
- See recycling history

---

## **Complete User Journey Example**

### **Scenario**: Consumer buys a new smartphone

**Day 1 - Purchase & Setup**:
1. Consumer buys iPhone from manufacturer
2. Manufacturer has already registered device (Blockchain ID: #5)
3. Consumer receives device with QR code sticker

**Day 2 - Claiming Ownership**:
1. Consumer logs in: `consumer@gmail.com` / `123456`
2. Consumer connects MetaMask wallet
3. Consumer registers wallet on blockchain (first time only)
4. Consumer clicks "Scan Device QR"
5. Consumer scans QR code → Blockchain ID: 5
6. System shows:
   ```
   ✅ Device Verified!
   Model: iPhone 13 Pro
   Serial: SN987654321
   Manufacturer: Apple Electronics
   Current Owner: Manufacturer Wallet
   Status: Manufactured
   ```
7. Consumer clicks "Claim Ownership"
8. MetaMask confirms transaction
9. ✅ Device now owned by consumer!
10. Device appears in "My Devices"

**2 Years Later - Device Usage**:
- Consumer uses device normally
- Device ownership recorded on blockchain
- Can verify authenticity anytime by scanning QR

**Year 3 - Recycling**:
1. Consumer decides to recycle old phone
2. Consumer contacts certified recycler
3. Recycler provides wallet address: `0x742d...bEb`
4. Consumer goes to "My Devices"
5. Consumer clicks "Recycle Device" on iPhone
6. Consumer enters recycler's wallet address
7. Consumer confirms MetaMask transaction
8. ✅ Device transferred to recycler!
9. Device status: "In Recycling"
10. Consumer's "Recycled Devices" count: +1

**After Recycling**:
- Recycler receives device ownership
- Recycler processes device responsibly
- Recycler submits recycling report
- Regulator verifies and approves
- Device status: "Recycled"
- ✅ Complete blockchain-verified lifecycle!

---

## **API Endpoints (Consumer)**

### **Authentication Required** (All endpoints)
- Bearer token in Authorization header
- Role must be "consumer"

### **Available Endpoints**:

```javascript
// Scan device by blockchain ID
GET /api/consumer/scan/:blockchainId
Response: Device info, blockchain data, history

// Claim device ownership
POST /api/consumer/claim-device
Body: { blockchainId, walletAddress, transactionHash }
Response: Success message, updated device

// Get all owned devices
GET /api/consumer/devices
Response: Array of devices, count

// Get single device details
GET /api/consumer/device/:id
Response: Full device info, blockchain data, history

// Initiate recycling
POST /api/consumer/recycle-device
Body: { deviceId, recyclerAddress, transactionHash }
Response: Success message, updated device

// Get statistics
GET /api/consumer/statistics
Response: { ownedDevices, recycledDevices }
```

---

## **Smart Contract Functions Used**

### **1. Scanning Device (Read-only)**
```solidity
function getDevice(uint256 deviceId)
  → Returns device struct with all details
  → No gas fee (read operation)
```

### **2. Claiming Ownership (Write operation)**
```solidity
function transferOwnership(uint256 deviceId, address newOwner)
  → Transfers device to new owner
  → Emits OwnershipTransferred event
  → Updates blockchain state
  → Requires gas fee
```

### **3. Recycling Device (Write operation)**
```solidity
function transferOwnership(uint256 deviceId, address recyclerAddress)
  → Transfers device to recycler
  → Records ownership history
  → Permanent blockchain record
  → Requires gas fee
```

---

## **Troubleshooting Guide**

### **Problem: Can't Login**
**Solution**:
- Verify credentials: `consumer@gmail.com` / `123456`
- Check backend server is running (port 5000)
- Check browser console for errors
- Clear browser cache and try again

### **Problem: MetaMask Not Connecting**
**Solution**:
- Check MetaMask extension is installed
- Click MetaMask icon in browser
- Ensure Ganache network is selected
- Network RPC: `http://127.0.0.1:7545`
- Chain ID: 1337
- Refresh page and reconnect

### **Problem: Transaction Failed**
**Solution**:
- Check sufficient ETH in account for gas
- Verify you're on correct network (Ganache)
- Check you own the device (for recycling)
- Verify contract address is correct
- Look at MetaMask error details
- Try increasing gas limit

### **Problem: Device Not Found**
**Solution**:
- Verify blockchain ID is correct (numeric)
- Ensure device was registered by manufacturer
- Check backend database has device entry
- Confirm Ganache blockchain is running
- Check smart contract is deployed

### **Problem: Can't Claim Device**
**Solution**:
- Ensure MetaMask is connected
- Check device isn't already claimed by you
- Verify you have permission to claim
- Device status must allow transfer
- Manufacturer must have registered it
- Check you're on correct account

### **Problem: Recycling Fails**
**Solution**:
- Verify recycler wallet address format
- Ensure recycler is registered in system
- Check you own the device
- Device status must allow recycling
- Verify sufficient gas for transaction
- Make sure recycler address is correct

### **Problem: QR Scanner Not Working**
**Solution**:
- Grant camera permissions in browser
- Try manual blockchain ID entry instead
- Check device has camera available
- Use alternative device with camera
- Enter blockchain ID directly (works same way)

---

## **Security & Privacy**

### **What's Stored on Blockchain** (Public):
- ✅ Device blockchain ID
- ✅ Manufacturer wallet address
- ✅ Current owner wallet address (anonymous)
- ✅ Ownership history (wallet addresses only)
- ✅ Device status (manufactured, in_use, recycled)
- ✅ Transaction timestamps
- ✅ Transaction hashes

### **What's NOT on Blockchain** (Private):
- ❌ Your name
- ❌ Your email address
- ❌ Your password
- ❌ Your phone number
- ❌ Personal information
- ❌ Location data
- ❌ Detailed device specifications

### **Privacy Protection**:
- Only wallet addresses visible on blockchain (pseudonymous)
- Personal data stored securely in backend database
- Passwords hashed (bcrypt)
- JWT tokens for authentication
- Role-based access control (RBAC)
- MongoDB for sensitive data storage

---

## **Benefits for Consumers**

### **✅ Authenticity Verification**
- Instantly verify products are genuine
- Check manufacturer legitimacy
- Prevent counterfeit purchases
- QR code-based verification

### **✅ Ownership Proof**
- Blockchain-verified ownership records
- Cannot be disputed or forged
- Permanent record of purchase
- Useful for warranties and insurance

### **✅ Complete Transparency**
- View entire device lifecycle
- See all previous owners
- Track device age and usage
- Verify device history before purchase

### **✅ Easy Recycling Process**
- Simple transfer to recyclers
- No paperwork required
- Blockchain-verified disposal
- Environmental responsibility tracking

### **✅ Environmental Impact**
- Track your recycling contributions
- See total devices recycled
- Contribute to e-waste reduction
- Blockchain-verified green credentials

### **✅ Tamper-Proof Records**
- Records cannot be altered
- Permanent blockchain storage
- Cryptographically secure
- Trustless verification

---

## **Best Practices**

### **For Claiming Devices**:
1. Always verify device details before claiming
2. Check serial numbers match physical device
3. Review ownership history for any red flags
4. Ensure MetaMask is connected on correct network
5. Save transaction hashes for records

### **For Recycling**:
1. Only use certified recyclers
2. Verify recycler's wallet address carefully
3. Keep device data backed up before recycling
4. Wipe device data personally first
5. Save recycling transaction hash

### **For Security**:
1. Never share your private keys
2. Don't share MetaMask seed phrase
3. Verify wallet addresses before transactions
4. Check transaction details in MetaMask
5. Keep wallet password secure
6. Log out when using shared computers

---

## **Quick Reference Checklist**

### **First Time Setup** ✓
- [ ] Install MetaMask extension
- [ ] Create/import MetaMask wallet
- [ ] Connect to Ganache network
- [ ] Login to consumer account
- [ ] Connect MetaMask to application
- [ ] Register wallet on blockchain
- [ ] Link wallet to account

### **Claiming a Device** ✓
- [ ] Login to consumer account
- [ ] Ensure MetaMask connected
- [ ] Click "Scan Device QR"
- [ ] Enter/scan blockchain ID
- [ ] Review device information
- [ ] Click "Claim Ownership"
- [ ] Confirm MetaMask transaction
- [ ] Wait for confirmation
- [ ] Verify device in "My Devices"

### **Recycling a Device** ✓
- [ ] Get recycler's wallet address
- [ ] Go to "My Devices"
- [ ] Select device to recycle
- [ ] Click "Recycle Device"
- [ ] Enter recycler wallet address
- [ ] Double-check address is correct
- [ ] Click "Recycle Device" button
- [ ] Confirm MetaMask transaction
- [ ] Wait for confirmation
- [ ] Verify device removed from list

---

## **Technical Stack**

### **Frontend**:
- React.js with Material-UI
- Web3.js for blockchain interaction
- React Router for navigation
- Context API for state management

### **Backend**:
- Node.js with Express
- MongoDB for database
- JWT authentication
- Bcrypt for password hashing

### **Blockchain**:
- Ethereum (Ganache local)
- Solidity smart contracts
- Web3 provider (MetaMask)
- Transaction management

---

## **Support & Help**

### **Common Questions**:

**Q: Do I need cryptocurrency?**
A: Yes, you need ETH in your MetaMask wallet for gas fees. Ganache provides test ETH.

**Q: Is my data safe?**
A: Yes. Personal data is encrypted in database. Only wallet addresses on blockchain.

**Q: Can I claim multiple devices?**
A: Yes! Claim as many devices as you own. All tracked in your account.

**Q: What if I lose my phone?**
A: Your devices are tied to your wallet address. Access from any device with MetaMask.

**Q: Can transactions be reversed?**
A: No. Blockchain transactions are permanent. Always verify before confirming.

**Q: How long do transactions take?**
A: On Ganache: 5-15 seconds. On mainnet: 30 seconds to several minutes.

---

## **Summary Workflow**

```
1. LOGIN (consumer@gmail.com / 123456)
   ↓
2. CONNECT METAMASK
   ↓
3. REGISTER WALLET (First time only)
   ↓
4. SCAN DEVICE QR CODE
   ↓
5. REVIEW DEVICE INFO
   ↓
6. CLAIM OWNERSHIP (MetaMask transaction)
   ↓
7. DEVICE ADDED TO "MY DEVICES"
   ↓
8. USE DEVICE
   ↓
9. RECYCLE DEVICE (When done)
   ↓
10. TRANSFER TO RECYCLER (MetaMask transaction)
    ↓
11. RECYCLER PROCESSES DEVICE
    ↓
12. COMPLETE LIFECYCLE TRACKED ON BLOCKCHAIN ✅
```

---

## **Next Steps**

After completing the consumer workflow:

1. **Explore Advanced Features**:
   - View detailed device timelines
   - Export ownership certificates
   - Share QR codes for verification
   - Track environmental impact

2. **Test Other Roles**:
   - Try manufacturer workflow
   - Test recycler functionality
   - Understand regulator oversight

3. **Integration**:
   - Integrate with real devices
   - Deploy to test network
   - Test with multiple users
   - Prepare for production

---

## **Contact & Resources**

- **System Administrator**: For technical issues
- **Backend API**: `http://localhost:5000`
- **Blockchain**: Ganache `http://127.0.0.1:7545`
- **Documentation**: Check other role guides

---

**🎉 Congratulations!**

You now know the complete consumer workflow from login to recycling. This system ensures transparent, tamper-proof tracking of electronic devices throughout their entire lifecycle!

**Remember**: Every scan, claim, and recycle is permanently recorded on the blockchain, creating an immutable history that promotes accountability and environmental responsibility.

---

**Document Version**: 1.0
**Last Updated**: 2025
**Role**: Consumer
**Login**: consumer@gmail.com / 123456
