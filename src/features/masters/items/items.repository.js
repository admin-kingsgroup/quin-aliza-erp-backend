const Item = require('./items.model');

const findAll = (filter, skip, limit) =>
  Item.find(filter).skip(skip).limit(limit).sort({ name: 1 }).lean();
const count = (filter) => Item.countDocuments(filter);
const findById = (id) => Item.findById(id).lean();
const findByCode = (code) => Item.findOne({ code }).lean();
const create = (data) => Item.create(data);
const updateById = (id, data) => Item.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
const deleteById = (id) => Item.findByIdAndDelete(id);

module.exports = { findAll, count, findById, findByCode, create, updateById, deleteById };
