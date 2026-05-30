const Customer = require('./customers.model');

const findAll = (filter, skip, limit) =>
  Customer.find(filter).skip(skip).limit(limit).sort({ name: 1 }).lean();
const count = (filter) => Customer.countDocuments(filter);
const findById = (id) => Customer.findById(id).lean();
const create = (data) => Customer.create(data);
const updateById = (id, data) => Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
const deleteById = (id) => Customer.findByIdAndDelete(id);

module.exports = { findAll, count, findById, create, updateById, deleteById };
