const router = require('express').Router();
const controller = require('./roles.controller');
const { authenticate, requireSuperAdmin } = require('../../shared/middleware/auth.middleware');

router.use(authenticate);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', requireSuperAdmin, controller.create);
router.put('/:id', requireSuperAdmin, controller.update);
router.delete('/:id', requireSuperAdmin, controller.remove);

module.exports = router;
