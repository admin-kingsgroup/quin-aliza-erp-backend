const router = require('express').Router();
const controller = require('./sales.controller');
const { createSaleValidator } = require('./sales.validator');
const { authenticate, authorize } = require('../../shared/middleware/auth.middleware');
const { PERMISSIONS } = require('../../shared/constants/permissions');

router.use(authenticate);

router.get('/', authorize(PERMISSIONS.SALES_READ), controller.getAll);
router.get('/:id', authorize(PERMISSIONS.SALES_READ), controller.getById);
router.post('/', authorize(PERMISSIONS.SALES_WRITE), createSaleValidator, controller.create);
router.put('/:id', authorize(PERMISSIONS.SALES_WRITE), controller.update);
router.post('/:id/cancel', authorize(PERMISSIONS.SALES_WRITE), controller.cancel);

module.exports = router;
