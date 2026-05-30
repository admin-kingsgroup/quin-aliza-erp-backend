const Supplier = require('./suppliers.model');

const findAll = (filter, skip, limit) =>
  Supplier.find(filter).skip(skip).limit(limit).sort({ name: 1 }).lean();
const count = (filter) => Supplier.countDocuments(filter);
const findById = (id) => Supplier.findById(id).lean();
const create = (data) => Supplier.create(data);
const updateById = (id, data) => Supplier.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
const deleteById = (id) => Supplier.findByIdAndDelete(id);

module.exports = { findAll, count, findById, create, updateById, deleteById };
