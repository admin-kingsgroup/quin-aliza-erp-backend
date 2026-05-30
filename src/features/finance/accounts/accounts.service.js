const repo = require('./accounts.repository');
const { AppError } = require('../../../shared/middleware/error.middleware');
const { sanitizeSearch } = require('../../../shared/utils/helpers');

const getAll = (query) => {
  const filter = { isActive: true };
  if (query.primaryGroup) filter.primaryGroup = query.primaryGroup;
  if (query.branchId) filter.$or = [{ branchId: query.branchId }, { hoOnly: false }];
  if (query.search) filter.name = { $regex: sanitizeSearch(query.search), $options: 'i' };
  return repo.findAll(filter);
};

const getById = async (id) => {
  const acc = await repo.findById(id);
  if (!acc) throw new AppError('Account not found', 404);
  return acc;
};

const create = async (data) => {
  const existing = await repo.findByCode(data.code);
  if (existing) throw new AppError('Account code already exists', 409);
  return repo.create(data);
};

const update = async (id, data) => {
  const acc = await repo.findById(id);
  if (!acc) throw new AppError('Account not found', 404);
  if (acc.isSystem) throw new AppError('Cannot modify system accounts', 403);
  return repo.updateById(id, data);
};

const remove = async (id) => {
  const acc = await repo.findById(id);
  if (!acc) throw new AppError('Account not found', 404);
  if (acc.isSystem) throw new AppError('Cannot delete system accounts', 403);
  return repo.deleteById(id);
};

module.exports = { getAll, getById, create, update, remove };
