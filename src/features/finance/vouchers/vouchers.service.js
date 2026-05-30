const repo = require('./vouchers.repository');
const { buildPaginationMeta, parsePagination, buildBranchFilter } = require('../../../shared/utils/helpers');
const { nextDocNumber } = require('../../../shared/utils/docSeries');
const { AppError } = require('../../../shared/middleware/error.middleware');
const { log } = require('../../../shared/utils/auditLog');

const getAll = async (query, user) => {
  const { page, limit } = parsePagination(query);
  const filter = { ...buildBranchFilter(user, query.branchId) };
  if (query.vType) filter.vType = query.vType;
  if (query.status) filter.status = query.status;
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = new Date(query.from);
    if (query.to) filter.date.$lte = new Date(query.to + 'T23:59:59Z');
  }
  if (query.partyId) filter.partyId = query.partyId;
  const [vouchers, total] = await Promise.all([
    repo.findAll(filter, (page - 1) * limit, limit),
    repo.count(filter),
  ]);
  return { vouchers, meta: buildPaginationMeta(total, page, limit) };
};

const getById = async (id) => {
  const v = await repo.findById(id);
  if (!v) throw new AppError('Voucher not found', 404);
  return v;
};

const create = async (data, user) => {
  const totalDebit = (data.lines || []).reduce((s, l) => s + (l.debit || 0), 0);
  const totalCredit = (data.lines || []).reduce((s, l) => s + (l.credit || 0), 0);
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new AppError('Voucher is unbalanced: debit and credit totals must match', 422);
  }
  data.voucherNo = await nextDocNumber(data.vType, data.branchId);
  data.createdBy = user._id;
  const voucher = await repo.create(data);
  await log({ userId: user._id, action: 'CREATE', entity: 'FinanceVoucher', entityId: voucher._id, branchId: data.branchId });
  return voucher;
};

const update = async (id, data, user) => {
  const existing = await repo.findById(id);
  if (!existing) throw new AppError('Voucher not found', 404);
  if (existing.status === 'cancelled') throw new AppError('Cannot edit a cancelled voucher', 400);
  if (data.lines) {
    const totalDebit = data.lines.reduce((s, l) => s + (l.debit || 0), 0);
    const totalCredit = data.lines.reduce((s, l) => s + (l.credit || 0), 0);
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new AppError('Voucher is unbalanced', 422);
    }
  }
  const voucher = await repo.updateById(id, data);
  await log({ userId: user._id, action: 'UPDATE', entity: 'FinanceVoucher', entityId: id, branchId: existing.branchId });
  return voucher;
};

const cancel = async (id, user) => {
  const existing = await repo.findById(id);
  if (!existing) throw new AppError('Voucher not found', 404);
  const voucher = await repo.updateById(id, { status: 'cancelled' });
  await log({ userId: user._id, action: 'CANCEL', entity: 'FinanceVoucher', entityId: id });
  return voucher;
};

const getLedger = async (accountId, query) => {
  const filter = {};
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = new Date(query.from);
    if (query.to) filter.date.$lte = new Date(query.to + 'T23:59:59Z');
  }
  if (query.branchId) filter.branchId = query.branchId;
  return repo.getLedger(accountId, filter);
};

module.exports = { getAll, getById, create, update, cancel, getLedger };
