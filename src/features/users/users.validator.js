const { body } = require('express-validator');

const createUserValidator = [
  body('name').notEmpty().trim().withMessage('Name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('roleId').notEmpty().withMessage('Role required'),
  body('businessMode').optional().isIn(['all', 'specific']),
];

const updateUserValidator = [
  body('name').optional().notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('roleId').optional().notEmpty(),
  body('status').optional().isIn(['active', 'inactive']),
  body('businessMode').optional().isIn(['all', 'specific']),
];

module.exports = { createUserValidator, updateUserValidator };
