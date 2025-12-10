# E-Waste Tracking System - Complete Guide

## Overview
This blockchain-based E-Waste tracking system has 4 main roles:
1. **Manufacturer** - Registers new devices
2. **Consumer** - Claims and uses devices
3. **Recycler** - Collects and processes devices for recycling
4. **Regulator** - Monitors compliance and verifies recycling reports

---

## Role 1: MANUFACTURER

### What Manufacturers Do:
- Register new electronic devices on the blockchain
- Generate QR codes for devices
- Track all manufactured devices

### Step-by-Step Process:

#### Step 1: Register as Manufacturer
```
POST /api/auth/register
{
  "name": "TechCorp Electronics",
  "email": "manufacturer@techcorp.com",
  "password": "secure123",
  "role": "manufacturer",
  "walletAddress": "0xManufacturerAddress123"
}
```

#### Step 2: Register User on Blockchain (from Frontend)
Call smart contract `registerUser(Role.Manufacturer)` using MetaMask

#### Step 3: Register a Device on Blockchain (from Frontend)
```javascript
// Call smart contract function
const tx = await contract.registerDevice("iPhone 14", "TechCorp");
const receipt = await tx.wait();
const deviceId = receipt.events[0].args.deviceId;
```

#### Step 4: Save Device Metadata to Database
```
POST /api/manufacturer/device/metadata
{
  "blockchainId": 1,
  "category": "Smartphone",
  "model": "iPhone 14 Pro",
  "serialNumber": "SN123456789",
  "weight": 240,
  "materials": ["aluminum", "glass", "lithium"],
  "transactionHash": "0xabc123...",
  "walletAddress": "0xManufacturerAddress123"
}
```

#### Step 5: View Registered Devices
```
GET /api/manufacturer/devices
```

**Output:** List of all devices with QR codes

---

## Role 2: CONSUMER

### What Consumers Do:
- Scan device QR codes
- Claim ownership of devices
- Use devices
- Transfer devices to recyclers when done

### Step-by-Step Process:

#### Step 1: Register as Consumer
```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123",
  "role": "consumer",
  "walletAddress": "0xConsumerAddress456"
}
```

#### Step 2: Register on Blockchain
Call smart contract `registerUser(Role.Consumer)` using MetaMask

#### Step 3: Scan Device QR Code
```
GET /api/consumer/scan/:blockchainId
```
Example: `GET /api/consumer/scan/1`

**Output:** Device information, manufacturer details, current status

#### Step 4: Claim Device Ownership (from Frontend)
```javascript
// Call smart contract
const tx = await contract.claimDevice(1); // deviceId = 1
const receipt = await tx.wait();
```

#### Step 5: Save Claim to Database
```
POST /api/consumer/claim-device
{
  "blockchainId": 1,
  "walletAddress": "0xConsumerAddress456",
  "transactionHash": "0xdef456..."
}
```

#### Step 6: View My Devices
```
GET /api/consumer/devices
```

#### Step 7: When Ready to Recycle - Transfer to Recycler (from Frontend)
```javascript
// Call smart contract
const tx = await contract.transferOwnership(1, "0xRecyclerAddress789");
const receipt = await tx.wait();
```

#### Step 8: Update Database
```
POST /api/consumer/recycle-device
{
  "deviceId": "mongoDbDeviceId",
  "recyclerAddress": "0xRecyclerAddress789",
  "transactionHash": "0xghi789..."
}
```

---

## Role 3: RECYCLER

### What Recyclers Do:
- Accept devices from consumers
- Mark devices as collected
- Process devices for recycling
- Submit recycling reports with component breakdown
- Wait for regulator verification

### Step-by-Step Process:

#### Step 1: Register as Recycler
```
POST /api/auth/register
{
  "name": "GreenRecycle Inc",
  "email": "recycler@greenrecycle.com",
  "password": "secure123",
  "role": "recycler",
  "walletAddress": "0xRecyclerAddress789"
}
```

#### Step 2: Register on Blockchain
Call smart contract `registerUser(Role.Recycler)` using MetaMask

#### Step 3: View Devices Received for Recycling
```
GET /api/recycler/devices
```

**Output:** All devices with status "in_recycling" or "collected"

#### Step 4: Update Device Status to "Collected" (from Frontend)
```javascript
// Call smart contract
const tx = await contract.updateDeviceStatus(1, DeviceStatus.Collected);
const receipt = await tx.wait();
```

#### Step 5: Update Status in Database
```
PUT /api/recycler/device/:id/status
{
  "status": "collected",
  "transactionHash": "0xjkl012..."
}
```

#### Step 6: Process Device and Submit Recycling Report (from Frontend)
```javascript
// Call smart contract
const tx = await contract.submitRecyclingReport(
  1,                    // deviceId
  240,                  // weight in grams
  "Aluminum: 120g, Glass: 80g, Lithium Battery: 40g"
);
const receipt = await tx.wait();
const reportId = receipt.events[0].args.reportId;
```

#### Step 7: Save Report to Database
```
POST /api/recycler/report
{
  "deviceId": "mongoDbDeviceId",
  "blockchainReportId": 1,
  "weight": 240,
  "components": {
    "aluminum": 120,
    "glass": 80,
    "lithiumBattery": 40
  },
  "notes": "Device successfully dismantled and components separated",
  "transactionHash": "0xmno345..."
}
```

#### Step 8: View All My Reports
```
GET /api/recycler/reports
```

#### Step 9: Check Report Verification Status
```
GET /api/recycler/report/:id
```

**Output:** Report details including verification status

#### Step 10: View Recycler Statistics
```
GET /api/recycler/statistics
```

**Output:**
- Collected devices count
- Recycled devices count
- Total reports submitted
- Verified reports count
- Pending reports count

---

## Role 4: REGULATOR

### What Regulators Do:
- Monitor all devices in the system
- View system-wide statistics
- Review recycling reports
- Verify recycling reports
- Check compliance scores
- Audit manufacturers and recyclers

### Step-by-Step Process:

#### Step 1: Register as Regulator
```
POST /api/auth/register
{
  "name": "EPA Environmental Officer",
  "email": "regulator@epa.gov",
  "password": "secure123",
  "role": "regulator",
  "walletAddress": "0xRegulatorAddress999"
}
```

#### Step 2: Register on Blockchain
Call smart contract `registerUser(Role.Regulator)` using MetaMask

#### Step 3: View All Devices in System
```
GET /api/regulator/devices
```

**Query Parameters:**
- `status`: Filter by status (manufactured, in_use, in_recycling, recycled)
- `manufacturer`: Filter by manufacturer ID
- `page`: Page number
- `limit`: Items per page

**Output:** All devices with manufacturer and owner information

#### Step 4: View All Recycling Reports
```
GET /api/regulator/reports?verified=false
```

**Output:** All unverified recycling reports waiting for review

#### Step 5: Review Specific Report Details
```
GET /api/recycler/report/:reportId
```

**Output:** Detailed report with device info, recycler info, components breakdown

#### Step 6: Verify Report on Blockchain (from Frontend)
```javascript
// Call smart contract
const tx = await contract.verifyReport(1); // reportId = 1
const receipt = await tx.wait();
```

#### Step 7: Update Verification in Database
```
PUT /api/regulator/report/:id/verify
{
  "transactionHash": "0xpqr678..."
}
```

#### Step 8: View System-Wide Statistics
```
GET /api/regulator/statistics
```

**Output:**
```json
{
  "devices": {
    "total": 1000,
    "active": 650,
    "inRecycling": 150,
    "recycled": 200,
    "recyclingRate": "20.00%",
    "statusBreakdown": [...]
  },
  "reports": {
    "total": 200,
    "verified": 180,
    "pending": 20
  },
  "users": {
    "manufacturers": 50,
    "consumers": 800,
    "recyclers": 25,
    "total": 875
  }
}
```

#### Step 9: Check Device Compliance
```
GET /api/regulator/device/:deviceId
```

**Output:** Compliance score and checks:
- Has manufacturer
- Has serial number
- Has QR code
- Is tracked
- Is recycled
- Has recycling report

#### Step 10: View All Manufacturers
```
GET /api/regulator/manufacturers
```

**Output:** List of manufacturers with device counts

#### Step 11: View All Recyclers
```
GET /api/regulator/recyclers
```

**Output:** List of recyclers with report counts and verification rates

---

## COMPLETE END-TO-END SCENARIO

### Scenario: iPhone 14 Lifecycle from Manufacturing to Recycling

#### PHASE 1: MANUFACTURING (TechCorp)

**Day 1:**
1. TechCorp registers as manufacturer
2. Registers on blockchain via MetaMask
3. Manufactures iPhone 14 Pro
4. Calls blockchain: `registerDevice("iPhone 14 Pro", "TechCorp")`
5. Gets Device ID = 1
6. Saves metadata to database with QR code
7. QR code is printed and attached to device box

**Blockchain State:**
- Device #1: Status = Manufactured, Owner = TechCorp

---

#### PHASE 2: CONSUMER PURCHASE (John Doe)

**Day 5:**
1. John buys iPhone from store
2. John registers as consumer
3. John scans QR code on box
4. Backend fetches device info: `GET /api/consumer/scan/1`
5. John sees: "Manufactured by TechCorp, Status: Manufactured"
6. John claims device via MetaMask: `claimDevice(1)`
7. Blockchain transfers ownership to John
8. Backend updates: `POST /api/consumer/claim-device`
9. John can now see device in "My Devices"

**Blockchain State:**
- Device #1: Status = InUse, Owner = John

---

#### PHASE 3: DEVICE USAGE

**Day 5 - Day 730 (2 years):**
- John uses iPhone normally
- Device ownership tracked on blockchain
- Regulator can view device status anytime

---

#### PHASE 4: RECYCLING INITIATION (John decides to recycle)

**Day 731:**
1. John decides to recycle old iPhone
2. John finds GreenRecycle Inc (registered recycler)
3. John initiates transfer via MetaMask:
   `transferOwnership(1, "0xRecyclerAddress789")`
4. Backend updates: `POST /api/consumer/recycle-device`
5. Device status = "in_recycling"
6. GreenRecycle receives notification

**Blockchain State:**
- Device #1: Status = InUse (will be updated by recycler)
- Owner = GreenRecycle Inc

---

#### PHASE 5: RECYCLING COLLECTION (GreenRecycle Inc)

**Day 732:**
1. GreenRecycle collects device from John
2. Updates status via MetaMask: `updateDeviceStatus(1, Collected)`
3. Backend updates: `PUT /api/recycler/device/1/status`
4. Device now shows as "collected"

**Blockchain State:**
- Device #1: Status = Collected, Owner = GreenRecycle

---

#### PHASE 6: RECYCLING PROCESSING

**Day 735:**
1. GreenRecycle dismantles device
2. Separates components:
   - Aluminum casing: 120g
   - Glass screen: 80g
   - Lithium battery: 40g
3. Takes photos of process
4. Submits report via MetaMask:
   ```
   submitRecyclingReport(
     1,
     240,
     "Aluminum: 120g, Glass: 80g, Lithium Battery: 40g"
   )
   ```
5. Gets Report ID = 1
6. Saves to database: `POST /api/recycler/report`
7. Device status automatically updated to "recycled"

**Blockchain State:**
- Device #1: Status = Recycled
- Report #1: Verified = false, Weight = 240g

---

#### PHASE 7: REGULATOR VERIFICATION (EPA Officer)

**Day 736:**
1. EPA officer logs in
2. Views pending reports: `GET /api/regulator/reports?verified=false`
3. Sees Report #1 from GreenRecycle
4. Reviews report details: `GET /api/recycler/report/1`
5. Checks:
   - Weight matches device specs
   - Components breakdown is accurate
   - Recycler is certified
6. Verifies report via MetaMask: `verifyReport(1)`
7. Backend updates: `PUT /api/regulator/report/1/verify`
8. Report now marked as verified

**Blockchain State:**
- Report #1: Verified = true, VerifiedBy = EPA Officer

---

#### PHASE 8: FINAL STATISTICS

**Day 737:**

**GreenRecycle Dashboard:**
- Total recycled: 1 device
- Verified reports: 1
- Pending reports: 0

**EPA Regulator Dashboard:**
- Total devices: 1
- Recycling rate: 100%
- Verified reports: 1
- Compliance score for Device #1: 100%

**System Audit Trail:**
1. Manufactured by TechCorp - Day 1
2. Claimed by John Doe - Day 5
3. Used for 2 years - Day 5-730
4. Transferred to GreenRecycle - Day 731
5. Collected - Day 732
6. Recycled with report - Day 735
7. Verified by EPA - Day 736

---

## KEY FEATURES

### Blockchain Benefits:
1. **Immutable Records** - Cannot alter device history
2. **Transparency** - All stakeholders can view device lifecycle
3. **Traceability** - Complete ownership chain
4. **Verification** - Cryptographic proof of recycling

### Database Benefits:
1. **Fast Queries** - Quick search and filtering
2. **Rich Metadata** - Store detailed device specifications
3. **User Management** - Handle authentication
4. **Relationships** - Link devices, users, reports

### Security:
1. **Role-Based Access** - Each role has specific permissions
2. **Wallet Authentication** - MetaMask integration
3. **Transaction Hashing** - All actions recorded with tx hash
4. **Smart Contract Validation** - Blockchain enforces rules

---

## API ENDPOINTS SUMMARY

### Authentication
- POST /api/auth/register
- POST /api/auth/login

### Manufacturer
- POST /api/manufacturer/device/metadata
- GET /api/manufacturer/devices
- GET /api/manufacturer/device/:id
- GET /api/manufacturer/statistics

### Consumer
- GET /api/consumer/scan/:blockchainId
- POST /api/consumer/claim-device
- GET /api/consumer/devices
- GET /api/consumer/device/:id
- POST /api/consumer/recycle-device
- GET /api/consumer/statistics

### Recycler
- GET /api/recycler/devices
- PUT /api/recycler/device/:id/status
- POST /api/recycler/report
- GET /api/recycler/reports
- GET /api/recycler/report/:id
- GET /api/recycler/statistics

### Regulator
- GET /api/regulator/devices
- GET /api/regulator/reports
- PUT /api/regulator/report/:id/verify
- GET /api/regulator/statistics
- GET /api/regulator/device/:id
- GET /api/regulator/manufacturers
- GET /api/regulator/recyclers

---

## SMART CONTRACT FUNCTIONS

### User Management
- `registerUser(Role _role)`
- `getUserRole(address _user)`
- `isUserRegistered(address _user)`

### Device Management
- `registerDevice(string _name, string _manufacturer)` → returns deviceId
- `claimDevice(uint256 _deviceId)`
- `transferOwnership(uint256 _deviceId, address _newOwner)`
- `updateDeviceStatus(uint256 _deviceId, DeviceStatus _status)`
- `getDevice(uint256 _deviceId)`
- `getDeviceHistory(uint256 _deviceId)`

### Recycling Reports
- `submitRecyclingReport(uint256 _deviceId, uint256 _weight, string _components)` → returns reportId
- `verifyReport(uint256 _reportId)`
- `getRecyclingReport(uint256 _reportId)`

---

## WORKFLOW DIAGRAM

```
Manufacturer          Consumer           Recycler          Regulator
    |                    |                  |                  |
    | Register Device    |                  |                  |
    |------------------>BC                  |                  |
    |                    |                  |                  |
    | Generate QR        |                  |                  |
    |                    |                  |                  |
    |                    | Scan QR          |                  |
    |                    | Claim Device     |                  |
    |                    |--------------->BC                   |
    |                    |                  |                  |
    |                    | Use Device       |                  |
    |                    | (2 years)        |                  |
    |                    |                  |                  |
    |                    | Transfer to      |                  |
    |                    | Recycler         |                  |
    |                    |--------------->BC                   |
    |                    |                  |                  |
    |                    |                  | Collect Device   |
    |                    |                  | Update Status    |
    |                    |                  |--------------->BC
    |                    |                  |                  |
    |                    |                  | Process Device   |
    |                    |                  | Submit Report    |
    |                    |                  |--------------->BC
    |                    |                  |                  |
    |                    |                  |                  | View Report
    |                    |                  |                  | Verify Report
    |                    |                  |                  |------------->BC
    |                    |                  |                  |
    |                    |                  | Get Verified     |
    |                    |                  | Notification     |
    |                    |                  |                  |

BC = Blockchain Transaction
```

---

## TESTING THE COMPLETE FLOW

### Prerequisites:
1. MetaMask installed
2. Local blockchain running (Ganache)
3. Contract deployed
4. Backend server running
5. Create 4 test accounts in MetaMask

### Test Steps:

1. **Setup 4 Users:**
   - Account 1: Manufacturer (TechCorp)
   - Account 2: Consumer (John)
   - Account 3: Recycler (GreenRecycle)
   - Account 4: Regulator (EPA)

2. **Manufacturer Flow:**
   - Register manufacturer
   - Register device on blockchain
   - Save metadata
   - Note device blockchain ID

3. **Consumer Flow:**
   - Register consumer
   - Scan device
   - Claim device
   - Later, transfer to recycler

4. **Recycler Flow:**
   - Register recycler
   - Accept device
   - Update to collected
   - Submit recycling report

5. **Regulator Flow:**
   - Register regulator
   - View all devices
   - Review report
   - Verify report

---

## CONCLUSION

This E-Waste tracking system provides complete lifecycle management of electronic devices with:

- **Transparency**: Every action recorded on blockchain
- **Accountability**: All parties tracked and verified
- **Compliance**: Automated monitoring and reporting
- **Incentivization**: Verified recyclers gain credibility
- **Environmental Impact**: Increases e-waste recycling rates

The combination of blockchain (for trust and immutability) and traditional database (for speed and flexibility) creates a robust solution for e-waste management.
