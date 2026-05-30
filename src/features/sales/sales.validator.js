const { body } = require('express-validator');

const createSaleValidator = [
  body('date').isISO8601().withMessage('Valid date required'),
  body('branchId').notEmpty().withMessage('Branch required'),
  body('lines').isArray({ min: 1 }).withMessage('At least one line item required'),
  body('lines.*.qty').isFloat({ min: 0.01 }).withMessage('Valid quantity required'),
  body('lines.*.rate').isFloat({ min: 0 }).withMessage('Valid rate required'),
];

module.exports = { createSaleValidator };
