const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  blockchainId: {
    type: Number,
    required: true,
    unique: true
  },
  qrCode: {
    type: String,
    unique: true
  },
  rfidTag: {
    type: String,
    default: null
  },
  specifications: {
    category: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    serialNumber: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      default: 0
    },
    materials: [{
      type: String
    }]
  },
  images: [{
    type: String
  }],
  manufacturerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionHashes: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
deviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Device', deviceSchema);
