const Role = require('./roles.model');

const findAll = () => Role.find().sort({ name: 1 }).lean();
const findById = (id) => Role.findById(id).lean();
const findByRoleId = (roleId) => Role.findOne({ roleId }).lean();
const create = (data) => Role.create(data);
const updateById = (id, data) => Role.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
const deleteById = (id) => Role.findByIdAndDelete(id);

module.exports = { findAll, findById, findByRoleId, create, updateById, deleteById };
