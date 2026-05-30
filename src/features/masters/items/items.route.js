const router = require('express').Router();
const controller = require('./items.controller');
const { createItemValidator, updateItemValidator } = require('./items.validator');
const { authenticate, authorize } = require('../../../shared/middleware/auth.middleware');
const { PERMISSIONS } = require('../../../shared/constants/permissions');

router.use(authenticate);

router.get('/', authorize(PERMISSIONS.MASTERS_READ), controller.getAll);
router.get('/:id', authorize(PERMISSIONS.MASTERS_READ), controller.getById);
router.post('/', authorize(PERMISSIONS.MASTERS_WRITE), createItemValidator, controller.create);
router.put('/:id', authorize(PERMISSIONS.MASTERS_WRITE), updateItemValidator, controller.update);
router.delete('/:id', authorize(PERMISSIONS.MASTERS_DELETE), controller.remove);

module.exports = router;
