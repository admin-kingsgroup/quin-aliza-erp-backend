const { body } = require('express-validator');

const VOUCHER_TYPES = [
  'sales', 'cashsale', 'creditsale', 'receipt', 'creditnote',
  'purchase', 'payment', 'debitnote', 'expense', 'contra', 'journal',
];

const createVoucherValidator = [
  body('vType').isIn(VOUCHER_TYPES).withMessage('Valid voucher type required'),
  body('date').isISO8601().withMessage('Valid date required'),
  body('branchId').notEmpty().withMessage('Branch required'),
  body('lines').isArray({ min: 1 }).withMessage('At least one line required'),
  body('lines.*.debit').optional().isFloat({ min: 0 }),
  body('lines.*.credit').optional().isFloat({ min: 0 }),
];

module.exports = { createVoucherValidator };
