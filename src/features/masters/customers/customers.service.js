const repo = require('./customers.repository');
const { buildPaginationMeta, parsePagination, sanitizeSearch } = require('../../../shared/utils/helpers');
const { AppError } = require('../../../shared/middleware/error.middleware');

const getAll = async (query) => {
  const { page, limit } = parsePagination(query);
  const filter = {};
  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';
  if (query.search) {
    filter.$or = [
      { name: { $regex: sanitizeSearch(query.search), $options: 'i' } },
      { phone: { $regex: sanitizeSearch(query.search), $options: 'i' } },
      { email: { $regex: sanitizeSearch(query.search), $options: 'i' } },
    ];
  }
  const [customers, total] = await Promise.all([
    repo.findAll(filter, (page - 1) * limit, limit),
    repo.count(filter),
  ]);
  return { customers, meta: buildPaginationMeta(total, page, limit) };
};

const getById = async (id) => {
  const customer = await repo.findById(id);
  if (!customer) throw new AppError('Customer not found', 404);
  return customer;
};

const create = (data) => repo.create(data);

const update = async (id, data) => {
  const customer = await repo.updateById(id, data);
  if (!customer) throw new AppError('Customer not found', 404);
  return customer;
};

const remove = async (id) => {
  const customer = await repo.deleteById(id);
  if (!customer) throw new AppError('Customer not found', 404);
};

module.exports = { getAll, getById, create, update, remove };
