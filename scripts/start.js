#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const waitOn = require('wait-on');

console.log('\n🚀 E-Waste Tracking - Starting Application...\n');

// Cleanup function for early exits
function cleanup(processes) {
  console.log('\n\n🛑 Shutting down gracefully...\n');
  processes.forEach(({ name, process: proc }) => {
    try {
      console.log(`  Stopping ${name}...`);
      proc.kill();
    } catch (err) {
      // Ignore errors during cleanup
    }
  });
  console.log('\n✅ All services stopped. Goodbye!\n');
}

// Kill any existing process on a given port (Windows-compatible)
async function killProcessOnPort(port) {
  return new Promise((resolve) => {
    const findCmd = process.platform === 'win32' 
      ? `netstat -ano | findstr :${port}` 
      : `lsof -ti:${port}`;
    
    const findProc = spawn(findCmd, {
      shell: true,
      stdio: ['ignore', 'pipe', 'ignore']
    });

    let output = '';
    findProc.stdout.on('data', (data) => {
      output += data.toString();
    });

    findProc.on('close', () => {
      if (output.trim()) {
        // Extract PID and kill it
        if (process.platform === 'win32') {
          const lines = output.trim().split('\n');
          const pids = new Set();
          lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && !isNaN(pid)) {
              pids.add(pid);
            }
          });
          pids.forEach(pid => {
            try {
              spawn('taskkill', ['/F', '/PID', pid], { shell: true, stdio: 'ignore' });
            } catch (e) { /* ignore */ }
          });
        } else {
          const pids = output.trim().split('\n');
          pids.forEach(pid => {
            try {
              spawn('kill', ['-9', pid], { shell: true, stdio: 'ignore' });
            } catch (e) { /* ignore */ }
          });
        }
        setTimeout(resolve, 1000); // Wait for processes to be killed
      } else {
        resolve();
      }
    });
  });
}

// Check if MongoDB is running
async function checkMongoDB() {
  try {
    await waitOn({
      resources: ['tcp:27017'],
      timeout: 5000,
      interval: 1000
    });
    console.log('✓ MongoDB is running\n');
    return true;
  } catch (err) {
    console.error('✗ MongoDB is not running on port 27017');
    console.error('  Please start MongoDB first:');
    console.error('  - Windows: net start MongoDB');
    console.error('  - Mac: brew services start mongodb-community');
    console.error('  - Linux: sudo systemctl start mongod\n');
    process.exit(1);
  }
}

// Start all services
async function startServices() {
  await checkMongoDB();

  console.log('📦 Starting services...\n');

  const rootDir = path.join(__dirname, '..');
  const processes = [];

  // Kill any existing Ganache process
  console.log('[Ganache] Checking for existing processes...');
  await killProcessOnPort(7545);

  // 1. Start Ganache
  console.log('[Ganache] Starting blockchain...');
  const ganache = spawn('npx', ['ganache', '--port', '7545', '--deterministic'], {
    cwd: rootDir,
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let ganacheReady = false;
  ganache.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Listening on') && !ganacheReady) {
      console.log('✓ [Ganache] Blockchain ready on port 7545\n');
      ganacheReady = true;
    }
  });

  ganache.stderr.on('data', (data) => {
    // Suppress most ganache logs unless it's an error
    const output = data.toString();
    if (output.includes('Error') || output.includes('error')) {
      console.error('[Ganache]', output);
    }
  });

  processes.push({ name: 'Ganache', process: ganache });

  // Wait for Ganache to be ready
  await waitOn({
    resources: ['tcp:7545'],
    timeout: 30000,
    interval: 1000
  }).catch(() => {
    console.error('✗ Failed to start Ganache');
    cleanup(processes);
    process.exit(1);
  });

  // 2. Start Backend
  console.log('[Backend] Starting server...');
  const backend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(rootDir, 'backend'),
    shell: true,
    stdio: ['ignore', 'inherit', 'inherit']
  });

  processes.push({ name: 'Backend', process: backend });

  // Wait for backend to be ready
  await waitOn({
    resources: ['http://localhost:5000/health'],
    timeout: 60000,
    interval: 2000
  }).catch(() => {
    console.error('✗ Failed to start backend');
    cleanup(processes);
    process.exit(1);
  });

  console.log('✓ [Backend] Server ready on port 5000\n');

  // 3. Start Frontend
  console.log('[Frontend] Starting React app...');
  const frontend = spawn('npm', ['start'], {
    cwd: path.join(rootDir, 'frontend'),
    shell: true,
    env: { ...process.env, BROWSER: 'none' }, // Prevent auto-opening browser
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let frontendReady = false;
  frontend.stdout.on('data', (data) => {
    const output = data.toString();
    if ((output.includes('Compiled successfully') || output.includes('webpack compiled')) && !frontendReady) {
      console.log('✓ [Frontend] React app ready on port 3000\n');
      console.log('━'.repeat(60));
      console.log('\n✅ All services started successfully!\n');
      console.log('   🌐 Frontend: http://localhost:3000');
      console.log('   🔧 Backend:  http://localhost:5000');
      console.log('   ⛓  Ganache:  http://localhost:7545\n');
      console.log('   Press Ctrl+C to stop all services\n');
      console.log('━'.repeat(60) + '\n');
      frontendReady = true;
    }
  });

  frontend.stderr.on('data', (data) => {
    // Only show errors, not warnings
    const output = data.toString();
    if (output.includes('Error') && !output.includes('warning')) {
      console.error('[Frontend]', output);
    }
  });

  processes.push({ name: 'Frontend', process: frontend });

  // Handle graceful shutdown
  process.on('SIGINT', () => cleanup(processes));
  process.on('SIGTERM', () => cleanup(processes));

  // Keep process alive
  process.stdin.resume();
}

// Start everything
startServices().catch((error) => {
  console.error('\n❌ Failed to start application:', error.message);
  process.exit(1);
});
