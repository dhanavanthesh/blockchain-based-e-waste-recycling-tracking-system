#!/usr/bin/env node

const { execSync } = require('child_process');
const treeKill = require('tree-kill');

console.log('\n🛑 Stopping all E-Waste Tracking services...\n');

// Find and kill processes on specific ports
function killProcessOnPort(port, name) {
  try {
    // Windows command to find process on port
    const command = process.platform === 'win32'
      ? `netstat -ano | findstr :${port}`
      : `lsof -ti:${port}`;

    const output = execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });

    if (output) {
      const lines = output.trim().split('\n');
      const pids = new Set();

      lines.forEach(line => {
        if (process.platform === 'win32') {
          // Extract PID from Windows netstat output (last column)
          const match = line.trim().match(/\s+(\d+)$/);
          if (match) {
            pids.add(match[1]);
          }
        } else {
          // Unix/Mac: lsof directly returns PID
          pids.add(line.trim());
        }
      });

      pids.forEach(pid => {
        try {
          if (process.platform === 'win32') {
            execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
          } else {
            treeKill(parseInt(pid), 'SIGTERM');
          }
          console.log(`✓ Stopped ${name} (PID: ${pid})`);
        } catch (err) {
          // Process might already be dead
        }
      });
    }
  } catch (error) {
    // No process found on this port, which is fine
  }
}

// Kill all services
killProcessOnPort(3000, 'Frontend');
killProcessOnPort(5000, 'Backend');
killProcessOnPort(7545, 'Ganache');

console.log('\n✅ All services stopped.\n');
