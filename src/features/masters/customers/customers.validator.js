const { body } = require('express-validator');

const createCustomerValidator = [
  body('name').notEmpty().trim().withMessage('Customer name required'),
  body('email').optional().isEmail().normalizeEmail(),
  body('creditLimit').optional().isFloat({ min: 0 }),
];

const updateCustomerValidator = [
  body('name').optional().notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('creditLimit').optional().isFloat({ min: 0 }),
  body('isActive').optional().isBoolean(),
];

module.exports = { createCustomerValidator, updateCustomerValidator };
