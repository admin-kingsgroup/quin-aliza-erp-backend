const router = require('express').Router();
const controller = require('./inventory.controller');
const { authenticate, authorize } = require('../../shared/middleware/auth.middleware');
const { PERMISSIONS } = require('../../shared/constants/permissions');

router.use(authenticate);

router.get('/stock', authorize(PERMISSIONS.INVENTORY_READ), controller.getStockSummary);
router.get('/movements', authorize(PERMISSIONS.INVENTORY_READ), controller.getMovements);
router.post('/movements', authorize(PERMISSIONS.INVENTORY_WRITE), controller.createMovement);

module.exports = router;
