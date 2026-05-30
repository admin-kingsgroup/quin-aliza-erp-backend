const router = require('express').Router();
const controller = require('./purchase.controller');
const { authenticate, authorize } = require('../../shared/middleware/auth.middleware');
const { PERMISSIONS } = require('../../shared/constants/permissions');

router.use(authenticate);

router.get('/', authorize(PERMISSIONS.PURCHASE_READ), controller.getAll);
router.get('/:id', authorize(PERMISSIONS.PURCHASE_READ), controller.getById);
router.post('/', authorize(PERMISSIONS.PURCHASE_WRITE), controller.create);
router.put('/:id', authorize(PERMISSIONS.PURCHASE_WRITE), controller.update);
router.post('/:id/cancel', authorize(PERMISSIONS.PURCHASE_WRITE), controller.cancel);

module.exports = router;
