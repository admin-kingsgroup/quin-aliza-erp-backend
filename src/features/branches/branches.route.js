const router = require('express').Router();
const controller = require('./branches.controller');
const { createBranchValidator, updateBranchValidator } = require('./branches.validator');
const { authenticate, authorize, requireSuperAdmin } = require('../../shared/middleware/auth.middleware');
const { PERMISSIONS } = require('../../shared/constants/permissions');

router.use(authenticate);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', requireSuperAdmin, createBranchValidator, controller.create);
router.put('/:id', authorize(PERMISSIONS.SETTINGS_WRITE), updateBranchValidator, controller.update);
router.delete('/:id', requireSuperAdmin, controller.remove);

module.exports = router;
