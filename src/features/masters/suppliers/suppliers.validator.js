const { body } = require('express-validator');

const createSupplierValidator = [
  body('name').notEmpty().trim().withMessage('Supplier name required'),
  body('type').isIn(['supplier', 'transporter', 'clearing_agent']).withMessage('Valid type required'),
  body('email').optional().isEmail().normalizeEmail(),
];

const updateSupplierValidator = [
  body('name').optional().notEmpty().trim(),
  body('type').optional().isIn(['supplier', 'transporter', 'clearing_agent']),
  body('email').optional().isEmail().normalizeEmail(),
  body('isActive').optional().isBoolean(),
];

module.exports = { createSupplierValidator, updateSupplierValidator };
