const { body } = require('express-validator');

const createItemValidator = [
  body('code').notEmpty().trim().withMessage('Item code required'),
  body('name').notEmpty().trim().withMessage('Item name required'),
  body('salesPrice').optional().isFloat({ min: 0 }),
  body('purchasePrice').optional().isFloat({ min: 0 }),
  body('reorderLevel').optional().isFloat({ min: 0 }),
];

const updateItemValidator = [
  body('name').optional().notEmpty().trim(),
  body('salesPrice').optional().isFloat({ min: 0 }),
  body('purchasePrice').optional().isFloat({ min: 0 }),
  body('isActive').optional().isBoolean(),
];

module.exports = { createItemValidator, updateItemValidator };
