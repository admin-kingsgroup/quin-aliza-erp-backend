const repo = require('./users.repository');
const { hashPassword } = require('../../shared/utils/bcrypt');
const { buildPaginationMeta, parsePagination, sanitizeSearch } = require('../../shared/utils/helpers');
const { AppError } = require('../../shared/middleware/error.middleware');

const getAll = async (query) => {
  const { page, limit } = parsePagination(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.roleId) filter.roleId = query.roleId;
  if (query.search) filter.name = { $regex: sanitizeSearch(query.search), $options: 'i' };
  const [users, total] = await Promise.all([
    repo.findAll(filter, (page - 1) * limit, limit),
    repo.count(filter),
  ]);
  return { users, meta: buildPaginationMeta(total, page, limit) };
};

const getById = async (id) => {
  const user = await repo.findById(id);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const create = async (data) => {
  const existing = await repo.findByEmail(data.email);
  if (existing) throw new AppError('Email already in use', 409);
  data.password = await hashPassword(data.password);
  return repo.create(data);
};

const update = async (id, data) => {
  if (data.password) data.password = await hashPassword(data.password);
  if (data.email) {
    const existing = await repo.findByEmail(data.email);
    if (existing && String(existing._id) !== String(id)) throw new AppError('Email already in use', 409);
  }
  const user = await repo.updateById(id, data);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const remove = async (id, requesterId) => {
  if (String(id) === String(requesterId)) throw new AppError('Cannot delete yourself', 400);
  const user = await repo.deleteById(id);
  if (!user) throw new AppError('User not found', 404);
};

module.exports = { getAll, getById, create, update, remove };
