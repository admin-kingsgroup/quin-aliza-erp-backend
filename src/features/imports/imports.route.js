const router = require('express').Router();
const controller = require('./imports.controller');
const { authenticate, authorize } = require('../../shared/middleware/auth.middleware');
const { PERMISSIONS } = require('../../shared/constants/permissions');

router.use(authenticate);

// Live tracker
router.get('/shipments', authorize(PERMISSIONS.IMPORTS_READ), controller.getShipments);

// Plans
router.get('/plans', authorize(PERMISSIONS.IMPORTS_READ), controller.getPlans);
router.post('/plans', authorize(PERMISSIONS.IMPORTS_WRITE), controller.createPlan);
router.put('/plans/:id', authorize(PERMISSIONS.IMPORTS_WRITE), controller.updatePlan);

// Vouchers
router.get('/vouchers', authorize(PERMISSIONS.IMPORTS_READ), controller.getVouchers);
router.get('/vouchers/:id', authorize(PERMISSIONS.IMPORTS_READ), controller.getVoucherById);
router.post('/vouchers', authorize(PERMISSIONS.IMPORTS_WRITE), controller.createVoucher);
router.put('/vouchers/:id', authorize(PERMISSIONS.IMPORTS_WRITE), controller.updateVoucher);
router.post('/vouchers/:id/steps/:stepKey', authorize(PERMISSIONS.IMPORTS_WRITE), controller.updateStep);
router.post('/vouchers/:id/payments', authorize(PERMISSIONS.IMPORTS_WRITE), controller.addPayment);

module.exports = router;
