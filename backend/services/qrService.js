const QRCode = require('qrcode');

// Generate QR code for device
const generateDeviceQR = async (deviceData) => {
  try {
    // Create QR data object
    const qrData = JSON.stringify({
      deviceId: deviceData.blockchainId,
      manufacturer: deviceData.manufacturerId,
      serialNumber: deviceData.specifications.serialNumber,
      timestamp: Date.now()
    });

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// Parse QR code data
const parseQRCode = (qrDataString) => {
  try {
    const qrData = JSON.parse(qrDataString);
    return qrData;
  } catch (error) {
    console.error('Error parsing QR code:', error);
    throw new Error('Invalid QR code format');
  }
};

module.exports = {
  generateDeviceQR,
  parseQRCode
};
