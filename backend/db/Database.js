const mongoose = require('mongoose');

let cachedConnection = null;

const connectionDatabase = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }
  
  try {
    const connection = await mongoose.connect(process.env.DB_URL);

    cachedConnection = connection;
    console.log(`mongo connected with server: ${connection.connection.host}`);
    return connection;

  } catch (err) {
    console.log('MongoDB connection error:', err);
    throw err;
  }
};

module.exports = {
  connectionDatabase
};