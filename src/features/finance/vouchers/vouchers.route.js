const router = require('express').Router();
const controller = require('./vouchers.controller');
const { createVoucherValidator } = require('./vouchers.validator');
const { authenticate, authorize } = require('../../../shared/middleware/auth.middleware');
const { PERMISSIONS } = require('../../../shared/constants/permissions');

router.use(authenticate);

router.get('/', authorize(PERMISSIONS.FINANCE_READ), controller.getAll);
router.get('/ledger/:accountId', authorize(PERMISSIONS.FINANCE_READ), controller.getLedger);
router.get('/:id', authorize(PERMISSIONS.FINANCE_READ), controller.getById);
router.post('/', authorize(PERMISSIONS.FINANCE_WRITE), createVoucherValidator, controller.create);
router.put('/:id', authorize(PERMISSIONS.FINANCE_WRITE), controller.update);
router.post('/:id/cancel', authorize(PERMISSIONS.FINANCE_WRITE), controller.cancel);

module.exports = router;
