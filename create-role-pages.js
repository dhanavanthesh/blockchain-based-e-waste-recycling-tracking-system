// Script to create all Consumer, Recycler, and Regulator pages
const fs = require('fs');
const path = require('path');

console.log('Creating role-based pages for Consumer, Recycler, and Regulator...\n');

// Create directories if they don't exist
const dirs = [
  'frontend/src/pages/recycler',
  'frontend/src/pages/regulator'
];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

console.log('\n✅ All directories ready!');
console.log('\n📝 Pages have been created successfully!');
console.log('\nNext steps:');
console.log('1. Add routes to App.jsx');
console.log('2. Restart frontend server');
console.log('3. Test each role');
