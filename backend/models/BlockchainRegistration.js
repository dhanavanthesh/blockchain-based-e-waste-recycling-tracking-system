const mongoose = require('mongoose');

const blockchainRegistrationSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  roles: [{
    type: String,
    enum: ['manufacturer', 'consumer', 'recycler', 'regulator']
  }],
  registrationDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BlockchainRegistration', blockchainRegistrationSchema);
