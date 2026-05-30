const router = require('express').Router();
const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});
const State = mongoose.models.State || mongoose.model('State', stateSchema);

router.get('/:key', async (req, res, next) => {
  try {
    const doc = await State.findOne({ key: req.params.key }).lean();
    res.json(doc ? { value: doc.value } : null);
  } catch (err) { next(err); }
});

router.put('/:key', async (req, res, next) => {
  try {
    const { value } = req.body;
    if (typeof value !== 'string') return res.status(400).json({ ok: false, error: 'value must be a string' });
    await State.findOneAndUpdate(
      { key: req.params.key },
      { value, updatedAt: new Date() },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete('/:key', async (req, res, next) => {
  try {
    await State.deleteOne({ key: req.params.key });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
