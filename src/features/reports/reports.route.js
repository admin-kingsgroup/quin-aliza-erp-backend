const router = require('express').Router();
const controller = require('./reports.controller');
const { authenticate, authorize } = require('../../shared/middleware/auth.middleware');
const { PERMISSIONS } = require('../../shared/constants/permissions');

router.use(authenticate, authorize(PERMISSIONS.REPORTS_READ));

router.get('/mis', controller.getMISSummary);
router.get('/sales-trend', controller.getSalesTrend);
router.get('/item-profitability', controller.getItemProfitability);
router.get('/branch-comparison', controller.getBranchComparison);

module.exports = router;
