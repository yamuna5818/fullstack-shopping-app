const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  // Reuse existing connection (important for serverless / cold starts)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  // Avoid multiple concurrent connection attempts
  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const err = new Error('MONGODB_URI environment variable is not set');
    console.error(err.message);
    throw err; // Don't process.exit(1) in serverless - let handler return 503
  }

  connectionPromise = mongoose.connect(uri).then((conn) => {
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  }).catch((error) => {
    connectionPromise = null;
    console.error(`MongoDB Error: ${error.message}`);
    throw error;
  });

  return connectionPromise;
};

module.exports = connectDB;
