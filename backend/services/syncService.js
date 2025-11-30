const { getContract } = require('./web3Service');
const Device = require('../models/Device');

let io; // Socket.io instance

// Initialize Socket.io
const initSocket = (socketInstance) => {
  io = socketInstance;
};

// Setup blockchain event listeners
const setupEventListeners = () => {
  try {
    const contract = getContract();

    // Listen to DeviceRegistered event
    contract.events.DeviceRegistered()
      .on('data', async (event) => {
        console.log('📱 Device Registered Event:', event.returnValues);

        if (io) {
          io.emit('device:registered', {
            deviceId: event.returnValues.deviceId,
            name: event.returnValues.name,
            manufacturer: event.returnValues.manufacturer
          });
        }
      })
      .on('error', console.error);

    // Listen to OwnershipTransferred event
    contract.events.OwnershipTransferred()
      .on('data', async (event) => {
        console.log('🔄 Ownership Transferred Event:', event.returnValues);

        // Update device in DB
        try {
          await Device.findOneAndUpdate(
            { blockchainId: Number(event.returnValues.deviceId) },
            { $set: { updatedAt: Date.now() } }
          );
        } catch (error) {
          console.error('Error updating device:', error);
        }

        if (io) {
          io.emit('device:transferred', {
            deviceId: event.returnValues.deviceId,
            from: event.returnValues.from,
            to: event.returnValues.to
          });
        }
      })
      .on('error', console.error);

    // Listen to StatusUpdated event
    contract.events.StatusUpdated()
      .on('data', async (event) => {
        console.log('🔧 Status Updated Event:', event.returnValues);

        if (io) {
          io.emit('device:statusUpdated', {
            deviceId: event.returnValues.deviceId,
            status: event.returnValues.status
          });
        }
      })
      .on('error', console.error);

    // Listen to RecyclingReportSubmitted event
    contract.events.RecyclingReportSubmitted()
      .on('data', async (event) => {
        console.log('📄 Recycling Report Submitted Event:', event.returnValues);

        if (io) {
          io.emit('report:submitted', {
            reportId: event.returnValues.reportId,
            deviceId: event.returnValues.deviceId,
            recycler: event.returnValues.recycler
          });
        }
      })
      .on('error', console.error);

    // Listen to ReportVerified event
    contract.events.ReportVerified()
      .on('data', async (event) => {
        console.log('✅ Report Verified Event:', event.returnValues);

        if (io) {
          io.emit('report:verified', {
            reportId: event.returnValues.reportId,
            verifiedBy: event.returnValues.verifiedBy
          });
        }
      })
      .on('error', console.error);

    console.log('✅ Blockchain event listeners setup complete');
  } catch (error) {
    console.error('❌ Error setting up event listeners:', error);
  }
};

module.exports = {
  initSocket,
  setupEventListeners
};
