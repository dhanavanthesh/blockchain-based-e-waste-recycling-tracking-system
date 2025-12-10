const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting blockchain deployment...\n');

try {
  // Step 1: Compile and deploy contracts
  console.log('📝 Compiling contracts...');
  execSync('truffle compile', { stdio: 'inherit', cwd: __dirname });

  console.log('\n📦 Deploying contracts to blockchain...');
  execSync('truffle migrate --reset', { stdio: 'inherit', cwd: __dirname });

  // Step 2: Read the deployed contract address
  console.log('\n🔍 Reading deployed contract address...');
  const networkFile = path.join(__dirname, 'build', 'contracts', 'EWasteTracking.json');

  if (!fs.existsSync(networkFile)) {
    throw new Error('Contract build file not found. Deployment may have failed.');
  }

  const contractJson = JSON.parse(fs.readFileSync(networkFile, 'utf8'));
  const networks = contractJson.networks;
  const networkIds = Object.keys(networks);

  if (networkIds.length === 0) {
    throw new Error('No deployed network found. Make sure Ganache is running.');
  }

  // Prefer Ganache network (5777) or get the highest network ID numerically
  let latestNetworkId;
  if (networks['5777']) {
    latestNetworkId = '5777';
    console.log('📍 Using Ganache network (5777)');
  } else {
    // Sort numerically to get the actual latest deployment
    latestNetworkId = networkIds.sort((a, b) => parseInt(b) - parseInt(a))[0];
    console.log(`📍 Using network ${latestNetworkId}`);
  }

  const contractAddress = networks[latestNetworkId].address;

  console.log(`✅ Contract deployed at: ${contractAddress}`);

  // Step 3: Update backend .env
  console.log('\n📝 Updating backend .env...');
  const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');
  let backendEnv = fs.readFileSync(backendEnvPath, 'utf8');

  // Replace or add CONTRACT_ADDRESS
  if (backendEnv.includes('CONTRACT_ADDRESS=')) {
    backendEnv = backendEnv.replace(/CONTRACT_ADDRESS=.*/g, `CONTRACT_ADDRESS=${contractAddress}`);
  } else {
    backendEnv += `\nCONTRACT_ADDRESS=${contractAddress}\n`;
  }

  fs.writeFileSync(backendEnvPath, backendEnv);
  console.log('✅ Backend .env updated');

  // Step 4: Update frontend .env
  console.log('📝 Updating frontend .env...');
  const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env');
  let frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');

  // Replace or add REACT_APP_CONTRACT_ADDRESS
  if (frontendEnv.includes('REACT_APP_CONTRACT_ADDRESS=')) {
    frontendEnv = frontendEnv.replace(/REACT_APP_CONTRACT_ADDRESS=.*/g, `REACT_APP_CONTRACT_ADDRESS=${contractAddress}`);
  } else {
    frontendEnv += `\nREACT_APP_CONTRACT_ADDRESS=${contractAddress}\n`;
  }

  fs.writeFileSync(frontendEnvPath, frontendEnv);
  console.log('✅ Frontend .env updated');

  // Step 5: Copy ABI to frontend
  console.log('📝 Copying contract ABI to frontend...');
  const abiOutputPath = path.join(__dirname, '..', 'frontend', 'src', 'config', 'contractABI.json');
  const abiData = {
    abi: contractJson.abi,
    contractName: 'EWasteTracking'
  };

  fs.writeFileSync(abiOutputPath, JSON.stringify(abiData, null, 2));
  console.log('✅ ABI copied to frontend');

  console.log('\n🎉 Deployment completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`   Contract Address: ${contractAddress}`);
  console.log(`   Backend .env: Updated`);
  console.log(`   Frontend .env: Updated`);
  console.log(`   Contract ABI: Copied to frontend`);
  console.log('\n🚀 You can now run:');
  console.log('   Backend:  cd backend && npm run dev');
  console.log('   Frontend: cd frontend && npm run dev');

} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
}
