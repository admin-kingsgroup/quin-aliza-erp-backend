const { body } = require('express-validator');

const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

const refreshValidator = [
  body('refreshToken').notEmpty().withMessage('Refresh token required'),
];

module.exports = { loginValidator, refreshValidator };
