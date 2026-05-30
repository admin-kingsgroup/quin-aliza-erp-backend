const repo = require('./suppliers.repository');
const { buildPaginationMeta, parsePagination, sanitizeSearch } = require('../../../shared/utils/helpers');
const { AppError } = require('../../../shared/middleware/error.middleware');

const getAll = async (query) => {
  const { page, limit } = parsePagination(query);
  const filter = {};
  if (query.type) filter.type = query.type;
  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';
  if (query.search) filter.name = { $regex: sanitizeSearch(query.search), $options: 'i' };
  const [suppliers, total] = await Promise.all([
    repo.findAll(filter, (page - 1) * limit, limit),
    repo.count(filter),
  ]);
  return { suppliers, meta: buildPaginationMeta(total, page, limit) };
};

const getById = async (id) => {
  const supplier = await repo.findById(id);
  if (!supplier) throw new AppError('Supplier not found', 404);
  return supplier;
};

const create = (data) => repo.create(data);

const update = async (id, data) => {
  const supplier = await repo.updateById(id, data);
  if (!supplier) throw new AppError('Supplier not found', 404);
  return supplier;
};

const remove = async (id) => {
  const supplier = await repo.deleteById(id);
  if (!supplier) throw new AppError('Supplier not found', 404);
};

module.exports = { getAll, getById, create, update, remove };
