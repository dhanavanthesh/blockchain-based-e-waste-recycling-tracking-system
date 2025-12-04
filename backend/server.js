require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { initWeb3 } = require('./services/web3Service');
const { initSocket, setupEventListeners } = require('./services/syncService');

// Import routes
const authRoutes = require('./routes/authRoutes');
const manufacturerRoutes = require('./routes/manufacturerRoutes');
const consumerRoutes = require('./routes/consumerRoutes');
const recyclerRoutes = require('./routes/recyclerRoutes');
const regulatorRoutes = require('./routes/regulatorRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Connect to MongoDB
connectDB();

// Initialize Web3
try {
  initWeb3();
} catch (error) {
  console.error('Failed to initialize Web3. Make sure Ganache is running.');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });

  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`Client ${socket.id} joined room: ${room}`);
  });
});

// Initialize Socket.io for sync service
initSocket(io);

// Setup blockchain event listeners
try {
  setupEventListeners();
} catch (error) {
  console.error('Failed to setup event listeners:', error);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/manufacturer', manufacturerRoutes);
app.use('/api/consumer', consumerRoutes);
app.use('/api/recycler', recyclerRoutes);
app.use('/api/regulator', regulatorRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, io };
