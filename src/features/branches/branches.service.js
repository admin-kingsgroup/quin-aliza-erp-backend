const repo = require('./branches.repository');
const { AppError } = require('../../shared/middleware/error.middleware');
const { buildBranchFilter } = require('../../shared/utils/helpers');

const getAll = async (query, user) => {
  const filter = { isActive: true };
  // Restrict to assigned branches for non-admin roles
  if (!['role_superadmin', 'role_owner', 'role_gm'].includes(user.roleId)) {
    if (user.businessIds?.length) filter._id = { $in: user.businessIds };
  }
  return repo.findAll(filter);
};

const getById = async (id) => {
  const branch = await repo.findById(id);
  if (!branch) throw new AppError('Branch not found', 404);
  return branch;
};

const create = (data) => repo.create(data);

const update = async (id, data) => {
  const branch = await repo.updateById(id, data);
  if (!branch) throw new AppError('Branch not found', 404);
  return branch;
};

const remove = async (id) => {
  const branch = await repo.deleteById(id);
  if (!branch) throw new AppError('Branch not found', 404);
};

module.exports = { getAll, getById, create, update, remove };
