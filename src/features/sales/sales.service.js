const SalesOrder = require('./sales.model');
const { buildPaginationMeta, parsePagination, buildBranchFilter, sanitizeSearch } = require('../../shared/utils/helpers');
const { nextDocNumber } = require('../../shared/utils/docSeries');
const { AppError } = require('../../shared/middleware/error.middleware');
const { log } = require('../../shared/utils/auditLog');

const getAll = async (query, user) => {
  const { page, limit } = parsePagination(query);
  const filter = { ...buildBranchFilter(user, query.branchId) };
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;
  if (query.customerId) filter.customerId = query.customerId;
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = new Date(query.from);
    if (query.to) filter.date.$lte = new Date(query.to + 'T23:59:59Z');
  }
  if (query.search) filter.orderNo = { $regex: sanitizeSearch(query.search), $options: 'i' };
  const [orders, total] = await Promise.all([
    SalesOrder.find(filter).skip((page - 1) * limit).limit(limit).sort({ date: -1 }).lean(),
    SalesOrder.countDocuments(filter),
  ]);
  return { orders, meta: buildPaginationMeta(total, page, limit) };
};

const getById = async (id) => {
  const order = await SalesOrder.findById(id).lean();
  if (!order) throw new AppError('Sales order not found', 404);
  return order;
};

const create = async (data, user) => {
  const type = data.type || 'sales';
  data.orderNo = await nextDocNumber(type === 'pos' ? 'POS' : 'SAL', data.branchId);
  data.createdBy = user._id;
  const order = new SalesOrder(data);
  await order.save();
  await log({ userId: user._id, action: 'CREATE', entity: 'SalesOrder', entityId: order._id, branchId: data.branchId });
  return order.toObject();
};

const update = async (id, data, user) => {
  const existing = await SalesOrder.findById(id);
  if (!existing) throw new AppError('Sales order not found', 404);
  if (existing.status === 'cancelled') throw new AppError('Cannot edit cancelled order', 400);
  Object.assign(existing, data);
  await existing.save();
  await log({ userId: user._id, action: 'UPDATE', entity: 'SalesOrder', entityId: id });
  return existing.toObject();
};

const cancel = async (id, user) => {
  const order = await SalesOrder.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true }).lean();
  if (!order) throw new AppError('Sales order not found', 404);
  await log({ userId: user._id, action: 'CANCEL', entity: 'SalesOrder', entityId: id });
  return order;
};

module.exports = { getAll, getById, create, update, cancel };
