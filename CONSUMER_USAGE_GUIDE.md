# Consumer Usage Guide - E-Waste Tracking System

## Login Credentials
- **Email**: consumer@gmail.com
- **Password**: 123456

## Complete Consumer Workflow

### Step 1: Login & Setup
1. Navigate to `/login`
2. Enter credentials: `consumer@gmail.com` / `123456`
3. After login, you'll be redirected to `/consumer/dashboard`

### Step 2: Connect MetaMask Wallet
1. On the dashboard, you'll see a warning if MetaMask is not connected
2. Click "Connect Now" button
3. Approve the MetaMask connection
4. Your wallet address will be displayed (e.g., `0x1234...5678`)

**Important**: Most features require MetaMask connection to interact with the blockchain

### Step 3: Scan a Device QR Code
1. On the dashboard, click **"Scan Device QR"** button (purple gradient button)
2. A dialog will open asking for the Blockchain ID
3. Enter the device's blockchain ID (e.g., `1`, `2`, `3` - numeric ID from manufacturer)
4. Click "Scan Device"

### Step 4: View Device Information
After scanning, you'll see:
- Device model and specifications
- Serial number
- Current owner
- Manufacturer information
- Complete ownership history (timeline view)
- Blockchain verification status

### Step 5: Claim Device Ownership
1. In the device dialog, click **"Claim Ownership"** button
2. MetaMask will prompt you to approve the blockchain transaction
3. Confirm the transaction in MetaMask
4. Wait for transaction confirmation
5. Device ownership will be transferred to you on the blockchain
6. Backend database will be updated automatically

**Transaction Details**: This creates a blockchain transaction that permanently records the ownership transfer

### Step 6: View Your Devices
1. From dashboard, click **"My Devices"** button
2. Or navigate to `/consumer/devices`
3. You'll see all devices you own:
   - Device cards with specifications
   - Current status badges
   - QR code access buttons
   - Recycling option buttons

### Step 7: Recycle a Device
When you're ready to recycle a device:

1. Go to "My Devices" page (`/consumer/devices`)
2. Find the device you want to recycle
3. Click **"Recycle Device"** button (orange button)
4. Enter the recycler's wallet address (e.g., `0xabcd...1234`)
5. Click "Recycle Device"
6. Approve the blockchain transaction in MetaMask
7. Device ownership will be transferred to the recycler
8. Device status changes to "In Recycling"

**Note**: Get the recycler's wallet address from the recycler directly

## Dashboard Features

### Statistics Cards
- **Owned Devices**: Number of devices you currently own
- **Recycled Devices**: Number of devices you've recycled
- **Blockchain Status**: Shows if wallet is connected

### Quick Actions
- **Scan Device QR**: Scan and claim new devices
- **My Devices**: View all your devices
- **Recycle Device**: Navigate to devices page to recycle
- **History**: View device ownership history

### How It Works Section
Visual guide showing the 4-step process:
1. **Verify Ownership**: Scan QR to verify authenticity
2. **Track History**: View complete device lifecycle
3. **Initiate Recycling**: Send to certified recyclers
4. **Get Certificate**: Receive blockchain-verified proof

## API Endpoints Used

### Consumer Endpoints
```
GET  /api/consumer/scan/:blockchainId     - Scan device by blockchain ID
POST /api/consumer/claim-device           - Claim device ownership
GET  /api/consumer/devices                - Get all owned devices
GET  /api/consumer/device/:id             - Get device details
POST /api/consumer/recycle-device         - Initiate recycling
GET  /api/consumer/statistics             - Get consumer statistics
```

## Blockchain Interactions

### 1. Scanning Device
- **Smart Contract Call**: `getDevice(blockchainId)` - Read-only
- **Purpose**: Verify device exists on blockchain
- **Gas**: None (read operation)

### 2. Claiming Ownership
- **Smart Contract Function**: `transferOwnership(deviceId, newOwner)`
- **From**: Current owner's address
- **To**: Your wallet address (consumer)
- **Gas**: Required (write operation)
- **Event Emitted**: `OwnershipTransferred`

### 3. Recycling Device
- **Smart Contract Function**: `transferOwnership(deviceId, recyclerAddress)`
- **From**: Your wallet address
- **To**: Recycler's wallet address
- **Gas**: Required (write operation)
- **Event Emitted**: `OwnershipTransferred`

## Troubleshooting

### MetaMask Not Connecting
- Ensure MetaMask extension is installed
- Check that you're on the correct network (Ganache local network)
- Network should be `http://127.0.0.1:7545`
- Make sure Ganache is running

### Transaction Fails
- Check you have enough ETH for gas fees
- Ensure you're the current owner of the device
- Verify wallet address is correct
- Check MetaMask for error details

### Device Not Found
- Verify the blockchain ID is correct
- Ensure device was registered by manufacturer
- Check that backend server is running

### Can't Claim Device
- Ensure MetaMask is connected
- Check that device isn't already owned by you
- Verify you have approval from current owner
- Ensure device status allows transfer

## Complete Device Lifecycle Example

### Scenario: Consumer buys a new phone

1. **Manufacturer** registers device → Blockchain ID: `5`
2. **Consumer** logs in to system
3. **Consumer** scans QR code with ID `5`
4. System shows:
   - Phone Model: "iPhone 13 Pro"
   - Manufacturer: "Apple Electronics"
   - Current Owner: Manufacturer
   - Status: "Manufactured"
5. **Consumer** clicks "Claim Ownership"
6. MetaMask pops up → Approve transaction
7. Blockchain records: Device #5 → New Owner: Consumer
8. Device now appears in "My Devices"
9. **Consumer** uses device for 2 years
10. **Consumer** decides to recycle
11. **Consumer** goes to "My Devices"
12. **Consumer** clicks "Recycle Device"
13. Enters recycler address: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
14. Approves transaction
15. Device status → "In Recycling"
16. Recycler can now process the device

## Security & Privacy

### What's Stored on Blockchain
- Device ID
- Manufacturer address
- Current owner address
- Ownership history
- Device status
- Timestamps

### What's NOT on Blockchain
- Your name
- Your email
- Your password
- Personal information

### Privacy Notes
- Only wallet addresses are visible on blockchain
- Device specifications stored in backend database
- Transaction history is public but pseudonymous

## Benefits for Consumers

✅ **Authenticity Verification**: Instantly verify genuine products
✅ **Ownership Proof**: Blockchain-verified ownership records
✅ **Transparency**: Complete device history visible
✅ **Easy Recycling**: Simple process to recycle responsibly
✅ **Environmental Impact**: Track your recycling contributions
✅ **Tamper-Proof**: Records cannot be altered or deleted

## Next Steps

After mastering the consumer workflow, you can:
1. Track multiple devices
2. Monitor recycling statistics
3. View device lifecycle timelines
4. Access QR codes for offline verification
5. Export ownership certificates
6. Share device authenticity with others

---

**Need Help?**
- Check MetaMask connection status
- Verify Ganache blockchain is running
- Ensure backend server is active
- Check browser console for errors
- Contact system administrator

## Summary

**Consumer Login** → **Connect MetaMask** → **Scan QR Code** → **Claim Device** → **View Devices** → **Recycle When Needed**

The entire process is blockchain-verified, transparent, and environmentally responsible!
