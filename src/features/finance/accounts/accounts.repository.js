const FinanceAccount = require('./accounts.model');

const findAll = (filter) => FinanceAccount.find(filter).sort({ primaryGroup: 1, name: 1 }).lean();
const findById = (id) => FinanceAccount.findById(id).lean();
const findByCode = (code) => FinanceAccount.findOne({ code }).lean();
const create = (data) => FinanceAccount.create(data);
const updateById = (id, data) =>
  FinanceAccount.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
const deleteById = (id) => FinanceAccount.findByIdAndDelete(id);

module.exports = { findAll, findById, findByCode, create, updateById, deleteById };
