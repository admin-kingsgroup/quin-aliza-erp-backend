const router = require('express').Router();
const Model = require('./price-lists.model');
const { authenticate, authorize } = require('../../../shared/middleware/auth.middleware');
const { PERMISSIONS } = require('../../../shared/constants/permissions');
const { AppError } = require('../../../shared/middleware/error.middleware');

router.use(authenticate);

router.get('/', authorize(PERMISSIONS.MASTERS_READ), async (req, res, next) => {
  try {
    res.json({ success: true, data: await Model.find().sort({ name: 1 }).lean() });
  } catch (err) { next(err); }
});

router.get('/:id', authorize(PERMISSIONS.MASTERS_READ), async (req, res, next) => {
  try {
    const data = await Model.findById(req.params.id).lean();
    if (!data) return next(new AppError('Not found', 404));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post('/', authorize(PERMISSIONS.MASTERS_WRITE), async (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: await Model.create(req.body) });
  } catch (err) { next(err); }
});

router.put('/:id', authorize(PERMISSIONS.MASTERS_WRITE), async (req, res, next) => {
  try {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!data) return next(new AppError('Not found', 404));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.delete('/:id', authorize(PERMISSIONS.MASTERS_DELETE), async (req, res, next) => {
  try {
    await Model.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;
