const router = require('express').Router();
const c = require('./approvals.controller');
const { authenticate, authorize } = require('../../shared/middleware/auth.middleware');
const { PERMISSIONS } = require('../../shared/constants/permissions');

router.use(authenticate);

router.get('/audit-log', authorize(PERMISSIONS.APPROVALS_MANAGE), c.getAuditLog);
router.get('/pending', authorize(PERMISSIONS.APPROVALS_MANAGE), c.getPendingApprovals);
router.get('/:id', authorize(PERMISSIONS.APPROVALS_MANAGE), c.getApprovalById);
router.post('/', c.createApprovalRequest);
router.post('/:id/process', authorize(PERMISSIONS.APPROVALS_MANAGE), c.processApproval);

module.exports = router;
