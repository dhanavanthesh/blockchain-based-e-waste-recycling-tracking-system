const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const BLOCKCHAIN_DIR = path.join(__dirname, '../../blockchain');
const BUILD_DIR = path.join(BLOCKCHAIN_DIR, 'build/contracts');
const CONTRACT_JSON = path.join(BUILD_DIR, 'EWasteTracking.json');
const BACKEND_ENV = path.join(__dirname, '../.env');
const FRONTEND_ENV = path.join(__dirname, '../../frontend/.env');
const FRONTEND_ABI = path.join(__dirname, '../../frontend/src/config/contractABI.json');

/**
 * Check if Ganache is running
 */
async function checkGanacheRunning() {
  const ganacheUrl = process.env.BLOCKCHAIN_URL || 'http://127.0.0.1:7545';
  const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));

  try {
    await web3.eth.net.isListening();
    console.log('✓ Ganache is running');
    return true;
  } catch (error) {
    throw new Error('Ganache is not running. Please start Ganache on port 7545');
  }
}

/**
 * Check if contracts are compiled
 */
function checkContractsCompiled() {
  if (!fs.existsSync(CONTRACT_JSON)) {
    return false;
  }
  console.log('✓ Contracts are compiled');
  return true;
}

/**
 * Compile contracts using Truffle
 */
function compileContracts() {
  console.log('📦 Compiling contracts...');
  try {
    execSync('npx truffle compile', {
      cwd: BLOCKCHAIN_DIR,
      stdio: 'inherit'
    });
    console.log('✓ Contracts compiled successfully');
  } catch (error) {
    throw new Error('Failed to compile contracts: ' + error.message);
  }
}

/**
 * Check if contract is deployed at the stored address
 */
async function checkContractDeployed() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    console.log('⚠ No contract address found in environment');
    return false;
  }

  const ganacheUrl = process.env.BLOCKCHAIN_URL || 'http://127.0.0.1:7545';
  const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));

  try {
    // Read contract ABI
    const contractData = JSON.parse(fs.readFileSync(CONTRACT_JSON, 'utf8'));
    const contract = new web3.eth.Contract(contractData.abi, contractAddress);

    // Try to call a view function to verify contract exists
    await contract.methods.deviceCount().call();
    console.log(`✓ Contract found at ${contractAddress}`);
    return true;
  } catch (error) {
    console.log('⚠ Contract not deployed or address invalid');
    return false;
  }
}

/**
 * Deploy contract using Truffle
 */
function deployContract() {
  console.log('🚀 Deploying smart contracts...');
  try {
    execSync('npx truffle migrate --reset', {
      cwd: BLOCKCHAIN_DIR,
      stdio: 'inherit'
    });
    console.log('✓ Contracts deployed successfully');

    // Read deployed contract address
    const contractData = JSON.parse(fs.readFileSync(CONTRACT_JSON, 'utf8'));
    const networks = contractData.networks;
    const networkIds = Object.keys(networks);

    if (networkIds.length === 0) {
      throw new Error('No deployed contract found in networks');
    }

    const latestNetworkId = networkIds[networkIds.length - 1];
    const contractAddress = networks[latestNetworkId].address;

    console.log(`📄 Contract deployed at: ${contractAddress}`);
    return { address: contractAddress, abi: contractData.abi };
  } catch (error) {
    throw new Error('Failed to deploy contracts: ' + error.message);
  }
}

/**
 * Update .env file with key-value pair
 */
function updateEnvFile(filePath, key, value) {
  let content = '';

  // Read existing content if file exists
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, 'utf8');
  }

  // Check if key exists
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    // Replace existing value
    content = content.replace(regex, `${key}=${value}`);
  } else {
    // Append new key-value pair
    if (content && !content.endsWith('\n')) {
      content += '\n';
    }
    content += `${key}=${value}\n`;
  }

  // Write back to file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Updated ${path.basename(filePath)}: ${key}`);
}

/**
 * Update all configuration files
 */
function updateAllConfigs(address, abi) {
  console.log('📝 Updating configuration files...');

  // Update backend .env
  updateEnvFile(BACKEND_ENV, 'CONTRACT_ADDRESS', address);

  // Update frontend .env
  updateEnvFile(FRONTEND_ENV, 'REACT_APP_CONTRACT_ADDRESS', address);

  // Update frontend ABI file
  const frontendAbiDir = path.dirname(FRONTEND_ABI);
  if (!fs.existsSync(frontendAbiDir)) {
    fs.mkdirSync(frontendAbiDir, { recursive: true });
  }

  // Read the full contract JSON and write to frontend
  const contractData = JSON.parse(fs.readFileSync(CONTRACT_JSON, 'utf8'));
  fs.writeFileSync(FRONTEND_ABI, JSON.stringify(contractData, null, 2), 'utf8');
  console.log('✓ Updated frontend ABI file');

  // Update backend web3Config.js by running exportABI script
  const exportABIScript = path.join(BLOCKCHAIN_DIR, 'scripts/exportABI.js');
  if (fs.existsSync(exportABIScript)) {
    try {
      execSync(`node ${exportABIScript}`, { stdio: 'inherit' });
    } catch (error) {
      console.warn('⚠ Failed to run exportABI script, but configs are updated');
    }
  }

  console.log('✅ All configuration files updated');
}

/**
 * Main function to ensure contract is deployed
 */
async function ensureContractDeployed() {
  console.log('\n🔍 Checking smart contract deployment...\n');

  try {
    // Step 1: Check Ganache
    await checkGanacheRunning();

    // Step 2: Check if contracts are compiled
    const compiled = checkContractsCompiled();
    if (!compiled) {
      compileContracts();
    }

    // Step 3: Check if contract is deployed
    const deployed = await checkContractDeployed();

    if (!deployed) {
      // Deploy contract
      const { address, abi } = deployContract();

      // Update all config files
      updateAllConfigs(address, abi);
    } else {
      // Even if deployed, ensure configs are synced
      const contractData = JSON.parse(fs.readFileSync(CONTRACT_JSON, 'utf8'));
      const networks = contractData.networks;
      const networkIds = Object.keys(networks);
      const latestNetworkId = networkIds[networkIds.length - 1];
      const address = networks[latestNetworkId].address;

      // Check if env files have the correct address
      const backendEnv = fs.readFileSync(BACKEND_ENV, 'utf8');
      const frontendEnv = fs.readFileSync(FRONTEND_ENV, 'utf8');

      const backendMatch = backendEnv.match(/CONTRACT_ADDRESS=(.+)/);
      const frontendMatch = frontendEnv.match(/REACT_APP_CONTRACT_ADDRESS=(.+)/);

      const backendAddress = backendMatch ? backendMatch[1].trim() : null;
      const frontendAddress = frontendMatch ? frontendMatch[1].trim() : null;

      if (backendAddress !== address || frontendAddress !== address) {
        console.log('⚠ Config files out of sync with deployed contract');
        updateAllConfigs(address, contractData.abi);
      }
    }

    console.log('\n✅ Smart contract deployment verified\n');
    return true;
  } catch (error) {
    console.error('\n❌ Error ensuring contract deployment:', error.message);
    throw error;
  }
}

module.exports = {
  ensureContractDeployed
};
