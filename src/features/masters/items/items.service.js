const repo = require('./items.repository');
const { buildPaginationMeta, parsePagination, sanitizeSearch } = require('../../../shared/utils/helpers');
const { AppError } = require('../../../shared/middleware/error.middleware');

const getAll = async (query) => {
  const { page, limit } = parsePagination(query);
  const filter = {};
  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';
  if (query.productType) filter.productType = query.productType;
  if (query.category) filter.category = { $regex: sanitizeSearch(query.category), $options: 'i' };
  if (query.search) {
    filter.$or = [
      { name: { $regex: sanitizeSearch(query.search), $options: 'i' } },
      { code: { $regex: sanitizeSearch(query.search), $options: 'i' } },
    ];
  }
  const [items, total] = await Promise.all([
    repo.findAll(filter, (page - 1) * limit, limit),
    repo.count(filter),
  ]);
  return { items, meta: buildPaginationMeta(total, page, limit) };
};

const getById = async (id) => {
  const item = await repo.findById(id);
  if (!item) throw new AppError('Item not found', 404);
  return item;
};

const create = async (data) => {
  const existing = await repo.findByCode(data.code);
  if (existing) throw new AppError('Item code already exists', 409);
  return repo.create(data);
};

const update = async (id, data) => {
  const item = await repo.updateById(id, data);
  if (!item) throw new AppError('Item not found', 404);
  return item;
};

const remove = async (id) => {
  const item = await repo.deleteById(id);
  if (!item) throw new AppError('Item not found', 404);
};

module.exports = { getAll, getById, create, update, remove };
