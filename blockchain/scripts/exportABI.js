const fs = require('fs');
const path = require('path');

// Read the compiled contract
const contractPath = path.join(__dirname, '../build/contracts/EWasteTracking.json');
const backendConfigPath = path.join(__dirname, '../../backend/config/web3Config.js');

try {
  // Check if build directory exists
  if (!fs.existsSync(path.join(__dirname, '../build'))) {
    console.error('Build directory not found. Please compile contracts first with: truffle compile');
    process.exit(1);
  }

  // Read contract JSON
  const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

  // Extract ABI and networks
  const abi = contractJson.abi;
  const networks = contractJson.networks;

  // Get the deployed contract address (assuming deployment to network 5777 or latest)
  let contractAddress = '';
  const networkIds = Object.keys(networks);

  if (networkIds.length > 0) {
    const latestNetworkId = networkIds[networkIds.length - 1];
    contractAddress = networks[latestNetworkId].address;
  }

  // Create the config file content
  const configContent = `// Auto-generated file - Do not edit manually
// Generated on: ${new Date().toISOString()}

const contractABI = ${JSON.stringify(abi, null, 2)};

const contractAddress = "${contractAddress}";

module.exports = {
  contractABI,
  contractAddress,
  networkId: ${networkIds[networkIds.length - 1] || 5777}
};
`;

  // Ensure backend/config directory exists
  const backendConfigDir = path.dirname(backendConfigPath);
  if (!fs.existsSync(backendConfigDir)) {
    fs.mkdirSync(backendConfigDir, { recursive: true });
  }

  // Write the config file
  fs.writeFileSync(backendConfigPath, configContent);

  console.log('✅ ABI and contract address exported successfully!');
  console.log(`📄 Contract Address: ${contractAddress}`);
  console.log(`📝 Config file created at: ${backendConfigPath}`);

} catch (error) {
  console.error('❌ Error exporting ABI:', error.message);
  process.exit(1);
}
