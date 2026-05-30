const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kbiz360';
  await mongoose.connect(uri);
  logger.info(`MongoDB connected: ${mongoose.connection.host}`);

  mongoose.connection.on('error', (err) => logger.error('MongoDB error:', err));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
};

module.exports = connectDB;
