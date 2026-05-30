const Branch = require('./branches.model');

const findAll = (filter) => Branch.find(filter).sort({ name: 1 }).lean();
const count = (filter) => Branch.countDocuments(filter);
const findById = (id) => Branch.findById(id).lean();
const create = (data) => Branch.create(data);
const updateById = (id, data) => Branch.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
const deleteById = (id) => Branch.findByIdAndDelete(id);

module.exports = { findAll, count, findById, create, updateById, deleteById };
