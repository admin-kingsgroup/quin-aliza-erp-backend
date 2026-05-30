const router = require('express').Router();
const controller = require('./users.controller');
const { createUserValidator, updateUserValidator } = require('./users.validator');
const { authenticate, authorize, requireSuperAdmin } = require('../../shared/middleware/auth.middleware');
const { PERMISSIONS } = require('../../shared/constants/permissions');

router.use(authenticate);

router.get('/', authorize(PERMISSIONS.USERS_READ), controller.getAll);
router.get('/:id', authorize(PERMISSIONS.USERS_READ), controller.getById);
router.post('/', requireSuperAdmin, createUserValidator, controller.create);
router.put('/:id', requireSuperAdmin, updateUserValidator, controller.update);
router.delete('/:id', requireSuperAdmin, controller.remove);

module.exports = router;
