const router = require('express').Router();
const controller = require('./auth.controller');
const { loginValidator, refreshValidator } = require('./auth.validator');
const { authenticate } = require('../../shared/middleware/auth.middleware');

router.post('/login', loginValidator, controller.login);
router.post('/refresh', refreshValidator, controller.refresh);
router.post('/logout', authenticate, controller.logout);
router.get('/me', authenticate, controller.me);

module.exports = router;
