const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn('[Database] No MONGO_URI provided in environment variables.');
    return;
  }

  const options = {
    serverSelectionTimeoutMS: 5000,
  };

  try {
    const conn = await mongoose.connect(uri, options);
    isConnected = true;
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.warn(`\n=============================================================`);
    console.warn(`[Database Notice] MongoDB Connection Error:`);
    console.warn(`  ${error.message}`);
    console.warn(`\n  👉 If using MongoDB Atlas:`);
    console.warn(`  1. Log into MongoDB Atlas (https://cloud.mongodb.com)`);
    console.warn(`  2. Navigate to: Security -> Network Access`);
    console.warn(`  3. Click "Add IP Address" -> Select "Allow Access from Anywhere" (0.0.0.0/0)`);
    console.warn(`  4. Confirm and wait ~1 minute for Atlas to apply changes.`);
    console.warn(`\n  ⚡ The backend server remains active with resilient auth fallback`);
    console.warn(`     so all demo logins and dashboards continue to work seamlessly!`);
    console.warn(`=============================================================\n`);

    // Auto-retry connection in the background every 15 seconds
    setTimeout(connectDB, 15000);
  }
};

mongoose.connection.on('connected', () => {
  isConnected = true;
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
});

module.exports = connectDB;
