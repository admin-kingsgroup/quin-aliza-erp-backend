const router = require('express').Router();
const controller = require('./finReports.controller');
const { authenticate, authorize } = require('../../../shared/middleware/auth.middleware');
const { PERMISSIONS } = require('../../../shared/constants/permissions');

router.use(authenticate, authorize(PERMISSIONS.FINANCE_READ));

router.get('/trial-balance', controller.getTrialBalance);
router.get('/pl', controller.getPL);
router.get('/balance-sheet', controller.getBalanceSheet);
router.get('/ar', controller.getAR);
router.get('/ap', controller.getAP);
router.get('/cashbook', controller.getCashBook);

module.exports = router;
