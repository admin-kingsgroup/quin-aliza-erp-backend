const FinanceVoucher = require('./vouchers.model');

const findAll = (filter, skip, limit) =>
  FinanceVoucher.find(filter).skip(skip).limit(limit).sort({ date: -1, createdAt: -1 }).lean();
const count = (filter) => FinanceVoucher.countDocuments(filter);
const findById = (id) => FinanceVoucher.findById(id).lean();
const create = (data) => FinanceVoucher.create(data);
const updateById = (id, data) =>
  FinanceVoucher.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
const deleteById = (id) => FinanceVoucher.findByIdAndDelete(id);

const getLedger = (accountId, filter) =>
  FinanceVoucher.find({ 'lines.accountId': accountId, ...filter })
    .sort({ date: 1 })
    .lean();

module.exports = { findAll, count, findById, create, updateById, deleteById, getLedger };
