const router = require('express').Router();
const c = require('./settings.controller');
const { authenticate, authorize } = require('../../shared/middleware/auth.middleware');
const { PERMISSIONS } = require('../../shared/constants/permissions');

router.use(authenticate);

router.get('/fx-rates', authorize(PERMISSIONS.SETTINGS_READ), c.getFxRates);
router.post('/fx-rates', authorize(PERMISSIONS.SETTINGS_WRITE), c.setFxRate);

router.get('/doc-series', authorize(PERMISSIONS.SETTINGS_READ), c.getDocSeries);
router.put('/doc-series/:id', authorize(PERMISSIONS.SETTINGS_WRITE), c.updateDocSeries);

router.get('/financial-years', authorize(PERMISSIONS.SETTINGS_READ), c.getFinancialYears);
router.post('/financial-years', authorize(PERMISSIONS.SETTINGS_WRITE), c.createFinancialYear);
router.put('/financial-years/:id', authorize(PERMISSIONS.SETTINGS_WRITE), c.updateFinancialYear);

router.get('/notifications', c.getNotifications);
router.post('/notifications/read-all', c.markNotificationsRead);

module.exports = router;
