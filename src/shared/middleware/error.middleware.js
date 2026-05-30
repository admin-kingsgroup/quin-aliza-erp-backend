const logger = require('../utils/logger');
const { NOT_FOUND, INTERNAL_ERROR } = require('../constants/statusCodes');

const notFound = (req, res) => {
  res.status(NOT_FOUND).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, url: req.originalUrl });

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(422).json({ success: false, message: 'Validation failed', errors });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res.status(409).json({ success: false, message: `Duplicate value for field: ${field}` });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  const status = err.statusCode || INTERNAL_ERROR;
  res.status(status).json({ success: false, message: err.message || 'Internal server error' });
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { notFound, errorHandler, AppError };
