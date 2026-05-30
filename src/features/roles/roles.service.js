const repo = require('./roles.repository');
const { AppError } = require('../../shared/middleware/error.middleware');

const getAll = () => repo.findAll();

const getById = async (id) => {
  const role = await repo.findById(id);
  if (!role) throw new AppError('Role not found', 404);
  return role;
};

const create = async (data) => {
  const existing = await repo.findByRoleId(data.roleId);
  if (existing) throw new AppError('Role ID already exists', 409);
  return repo.create(data);
};

const update = async (id, data) => {
  const role = await repo.findById(id);
  if (!role) throw new AppError('Role not found', 404);
  if (role.isSystem) throw new AppError('Cannot modify system roles', 403);
  return repo.updateById(id, data);
};

const remove = async (id) => {
  const role = await repo.findById(id);
  if (!role) throw new AppError('Role not found', 404);
  if (role.isSystem) throw new AppError('Cannot delete system roles', 403);
  return repo.deleteById(id);
};

module.exports = { getAll, getById, create, update, remove };
