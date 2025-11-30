export const DEVICE_STATUS = {
  0: { label: 'Manufactured', color: 'primary' },
  1: { label: 'In Use', color: 'success' },
  2: { label: 'Collected', color: 'warning' },
  3: { label: 'Destroyed', color: 'error' },
  4: { label: 'Recycled', color: 'secondary' }
};

export const USER_ROLES = {
  MANUFACTURER: 'manufacturer',
  CONSUMER: 'consumer',
  RECYCLER: 'recycler',
  REGULATOR: 'regulator'
};

export const BLOCKCHAIN_ROLES = {
  manufacturer: 1,
  consumer: 2,
  recycler: 3,
  regulator: 4
};

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
