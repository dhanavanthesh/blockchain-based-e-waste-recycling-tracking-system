// Auto-generated file - Do not edit manually
// Generated on: 2025-12-03T11:37:56.621Z

const path = require('path');
const fs = require('fs');

// Read contract address from frontend .env
const frontendEnvPath = path.join(__dirname, '../../frontend/.env');
let contractAddressFromEnv = null;

if (fs.existsSync(frontendEnvPath)) {
  const envContent = fs.readFileSync(frontendEnvPath, 'utf8');
  const match = envContent.match(/REACT_APP_CONTRACT_ADDRESS=(.+)/);
  if (match) {
    contractAddressFromEnv = match[1].trim();
  }
}

const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "deviceId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "manufacturer",
        "type": "address"
      }
    ],
    "name": "DeviceRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "deviceId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "reportId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "deviceId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recycler",
        "type": "address"
      }
    ],
    "name": "RecyclingReportSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "reportId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "verifiedBy",
        "type": "address"
      }
    ],
    "name": "ReportVerified",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "deviceId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum EWasteTracking.DeviceStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "name": "StatusUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum EWasteTracking.Role",
        "name": "role",
        "type": "uint8"
      }
    ],
    "name": "UserRegistered",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "deviceCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "deviceOwnerHistory",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "devices",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturer",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "manufacturerAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "currentOwner",
        "type": "address"
      },
      {
        "internalType": "enum EWasteTracking.DeviceStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "manufacturedDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastUpdated",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "recyclingReports",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deviceId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recyclerAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "weight",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "components",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "verified",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "verifiedBy",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "reportCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "users",
    "outputs": [
      {
        "internalType": "address",
        "name": "walletAddress",
        "type": "address"
      },
      {
        "internalType": "enum EWasteTracking.Role",
        "name": "role",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "enum EWasteTracking.Role",
        "name": "_role",
        "type": "uint8"
      }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserRole",
    "outputs": [
      {
        "internalType": "enum EWasteTracking.Role",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "isUserRegistered",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_manufacturer",
        "type": "string"
      }
    ],
    "name": "registerDevice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_deviceId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_deviceId",
        "type": "uint256"
      },
      {
        "internalType": "enum EWasteTracking.DeviceStatus",
        "name": "_status",
        "type": "uint8"
      }
    ],
    "name": "updateDeviceStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_deviceId",
        "type": "uint256"
      }
    ],
    "name": "getDevice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturer",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "manufacturerAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "currentOwner",
        "type": "address"
      },
      {
        "internalType": "enum EWasteTracking.DeviceStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "manufacturedDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastUpdated",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_deviceId",
        "type": "uint256"
      }
    ],
    "name": "getDeviceHistory",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "getDevicesByOwner",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_deviceId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_weight",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_components",
        "type": "string"
      }
    ],
    "name": "submitRecyclingReport",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_reportId",
        "type": "uint256"
      }
    ],
    "name": "verifyReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_reportId",
        "type": "uint256"
      }
    ],
    "name": "getRecyclingReport",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deviceId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recyclerAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "weight",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "components",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "verified",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "verifiedBy",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getAllDevices",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getAllReports",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

const contractAddress = contractAddressFromEnv || process.env.CONTRACT_ADDRESS || "0xCe907818Fa2467BC90d0c740F2980341dc5365A9";

module.exports = {
  contractABI,
  contractAddress,
  networkId: 5777
};
