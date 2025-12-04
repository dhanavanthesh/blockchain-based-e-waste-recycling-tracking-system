const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ewaste_tracking').then(async () => {
  const Device = require('./models/Device');
  const User = require('./models/User');

  const consumer = await User.findOne({email: 'consumer@gmail.com'});
  const device = await Device.findOne({blockchainId: 2});

  if(device && consumer) {
    device.currentOwnerId = consumer._id;
    device.status = 'in_use';
    if(!device.ownershipHistory) device.ownershipHistory = [];
    device.ownershipHistory.push({
      ownerId: consumer._id,
      transferDate: new Date()
    });
    await device.save();
    console.log('✅ Device ownership updated in database!');
    console.log('Current Owner:', consumer.name);
    console.log('Status:', device.status);
  } else {
    console.log('❌ Device or consumer not found');
  }

  process.exit();
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
