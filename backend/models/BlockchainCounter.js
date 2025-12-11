const mongoose = require('mongoose');

const blockchainCounterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model('BlockchainCounter', blockchainCounterSchema);
