const PurchaseOrder = require('./purchase.model');
const { buildPaginationMeta, parsePagination, buildBranchFilter } = require('../../shared/utils/helpers');
const { nextDocNumber } = require('../../shared/utils/docSeries');
const { AppError } = require('../../shared/middleware/error.middleware');
const { log } = require('../../shared/utils/auditLog');

const getAll = async (query, user) => {
  const { page, limit } = parsePagination(query);
  const filter = { ...buildBranchFilter(user, query.branchId) };
  if (query.status) filter.status = query.status;
  if (query.supplierId) filter.supplierId = query.supplierId;
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = new Date(query.from);
    if (query.to) filter.date.$lte = new Date(query.to + 'T23:59:59Z');
  }
  const [orders, total] = await Promise.all([
    PurchaseOrder.find(filter).skip((page - 1) * limit).limit(limit).sort({ date: -1 }).lean(),
    PurchaseOrder.countDocuments(filter),
  ]);
  return { orders, meta: buildPaginationMeta(total, page, limit) };
};

const getById = async (id) => {
  const order = await PurchaseOrder.findById(id).lean();
  if (!order) throw new AppError('Purchase order not found', 404);
  return order;
};

const create = async (data, user) => {
  data.poNo = await nextDocNumber('PO', data.branchId);
  data.createdBy = user._id;
  const order = new PurchaseOrder(data);
  await order.save();
  await log({ userId: user._id, action: 'CREATE', entity: 'PurchaseOrder', entityId: order._id, branchId: data.branchId });
  return order.toObject();
};

const update = async (id, data, user) => {
  const existing = await PurchaseOrder.findById(id);
  if (!existing) throw new AppError('Purchase order not found', 404);
  if (existing.status === 'cancelled') throw new AppError('Cannot edit cancelled order', 400);
  Object.assign(existing, data);
  await existing.save();
  await log({ userId: user._id, action: 'UPDATE', entity: 'PurchaseOrder', entityId: id });
  return existing.toObject();
};

const cancel = async (id, user) => {
  const order = await PurchaseOrder.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true }).lean();
  if (!order) throw new AppError('Purchase order not found', 404);
  await log({ userId: user._id, action: 'CANCEL', entity: 'PurchaseOrder', entityId: id });
  return order;
};

module.exports = { getAll, getById, create, update, cancel };
