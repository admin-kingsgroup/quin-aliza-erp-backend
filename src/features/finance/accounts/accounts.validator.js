const { body } = require('express-validator');

const createAccountValidator = [
  body('code').notEmpty().trim().withMessage('Account code required'),
  body('name').notEmpty().trim().withMessage('Account name required'),
  body('group').notEmpty().withMessage('Group required'),
  body('primaryGroup').isIn(['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses']).withMessage('Valid primary group required'),
  body('side').isIn(['Debit', 'Credit']).withMessage('Side must be Debit or Credit'),
];

module.exports = { createAccountValidator };
