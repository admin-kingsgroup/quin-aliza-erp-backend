const Godown = require('./godowns.model');
const { AppError } = require('../../../shared/middleware/error.middleware');

const getAll = (query) => {
  const filter = {};
  if (query.branchId) filter.branchId = query.branchId;
  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';
  return Godown.find(filter).sort({ name: 1 }).lean();
};

const getById = async (id) => {
  const g = await Godown.findById(id).lean();
  if (!g) throw new AppError('Godown not found', 404);
  return g;
};

const create = (data) => Godown.create(data);

const update = async (id, data) => {
  const g = await Godown.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  if (!g) throw new AppError('Godown not found', 404);
  return g;
};

const remove = async (id) => {
  const g = await Godown.findByIdAndDelete(id);
  if (!g) throw new AppError('Godown not found', 404);
};

module.exports = { getAll, getById, create, update, remove };
