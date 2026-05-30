const { body } = require('express-validator');

const createBranchValidator = [
  body('branchCode').notEmpty().trim().withMessage('Branch code required'),
  body('name').notEmpty().trim().withMessage('Branch name required'),
  body('branchType').optional().isIn(['HO', 'Branch', 'Warehouse']),
];

const updateBranchValidator = [
  body('name').optional().notEmpty().trim(),
  body('branchType').optional().isIn(['HO', 'Branch', 'Warehouse']),
  body('isActive').optional().isBoolean(),
];

module.exports = { createBranchValidator, updateBranchValidator };
