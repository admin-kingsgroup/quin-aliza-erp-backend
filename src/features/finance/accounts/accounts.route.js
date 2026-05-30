const router = require('express').Router();
const controller = require('./accounts.controller');
const { createAccountValidator } = require('./accounts.validator');
const { authenticate, authorize } = require('../../../shared/middleware/auth.middleware');
const { PERMISSIONS } = require('../../../shared/constants/permissions');

router.use(authenticate);

router.get('/', authorize(PERMISSIONS.FINANCE_READ), controller.getAll);
router.get('/:id', authorize(PERMISSIONS.FINANCE_READ), controller.getById);
router.post('/', authorize(PERMISSIONS.FINANCE_WRITE), createAccountValidator, controller.create);
router.put('/:id', authorize(PERMISSIONS.FINANCE_WRITE), controller.update);
router.delete('/:id', authorize(PERMISSIONS.FINANCE_WRITE), controller.remove);

module.exports = router;
