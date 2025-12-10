const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/ewaste_tracking';

async function clearDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);

    console.log('🗑️  Clearing database...');
    await mongoose.connection.db.dropDatabase();

    console.log('✅ Database cleared successfully!');
    console.log('📋 All users, devices, and data have been removed.');
    console.log('🔄 You can now start fresh with the new contract!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    process.exit(1);
  }
}

clearDatabase();
