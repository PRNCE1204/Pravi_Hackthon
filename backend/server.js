const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Database connection & Seeder
const connectDB = require('./config/db');
const { seedUsers } = require('./seed/seedUsers');

// Route imports
const authRoutes = require('./routes/authRoutes');

const app = express();

// CORS configuration - Support localhost:5173 and any client origin with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check
app.get('/', (req, res) => {
  res.json({
    status: 'Server Running',
    database: mongoose.connection.readyState === 1 ? 'MongoDB Atlas Connected' : 'Connecting / Standby Mode',
    platform: 'Government Project Management Platform',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server Running',
    database: mongoose.connection.readyState === 1 ? 'MongoDB Atlas Connected' : 'Connecting / Standby Mode',
    platform: 'Government Project Management Platform',
    timestamp: new Date().toISOString(),
  });
});

// Authentication & RBAC Routes
app.use('/api/auth', authRoutes);

// Role verification test route
const { protect } = require('./middleware/authMiddleware');
const { allowRoles } = require('./middleware/roleMiddleware');

app.get(
  '/api/test-role/:role',
  protect,
  (req, res, next) => {
    return allowRoles(req.params.role)(req, res, next);
  },
  (req, res) => {
    res.json({
      success: true,
      message: `Access granted for user ${req.user.name} with role ${req.user.role}`,
    });
  }
);

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Listen on port 5000 immediately so frontend never receives ERR_CONNECTION_REFUSED
app.listen(PORT, () => {
  console.log(`\n🚀 GovPM Backend Server running on port ${PORT}`);
  console.log(`🌐 Health endpoint: http://localhost:${PORT}/api/health\n`);

  // Connect to Database and auto-seed users
  connectDB().then(async (conn) => {
    if (conn) {
      await seedUsers();
    }
  });
});

// Also trigger seedUsers whenever connection is re-established
mongoose.connection.on('connected', async () => {
  await seedUsers();
});

module.exports = app;
