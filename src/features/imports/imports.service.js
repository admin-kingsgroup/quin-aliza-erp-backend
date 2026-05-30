const { ImportVoucher, ImportPlan } = require('./imports.model');
const { buildPaginationMeta, parsePagination, buildBranchFilter } = require('../../shared/utils/helpers');
const { nextDocNumber } = require('../../shared/utils/docSeries');
const { AppError } = require('../../shared/middleware/error.middleware');
const { log } = require('../../shared/utils/auditLog');

// Vouchers
const getVouchers = async (query, user) => {
  const { page, limit } = parsePagination(query);
  const filter = { ...buildBranchFilter(user, query.branchId) };
  if (query.impoType) filter.impoType = query.impoType;
  if (query.status) filter.status = query.status;
  if (query.supplierId) filter.supplierId = query.supplierId;
  if (query.from || query.to) {
    filter.orderDate = {};
    if (query.from) filter.orderDate.$gte = new Date(query.from);
    if (query.to) filter.orderDate.$lte = new Date(query.to + 'T23:59:59Z');
  }
  const [vouchers, total] = await Promise.all([
    ImportVoucher.find(filter).skip((page - 1) * limit).limit(limit).sort({ orderDate: -1 }).lean(),
    ImportVoucher.countDocuments(filter),
  ]);
  return { vouchers, meta: buildPaginationMeta(total, page, limit) };
};

const getVoucherById = async (id) => {
  const v = await ImportVoucher.findById(id).lean();
  if (!v) throw new AppError('Import voucher not found', 404);
  return v;
};

const createVoucher = async (data, user) => {
  const prefix = { HD: 'IHD', MTL: 'IMT', AIR: 'IAR' }[data.impoType] || 'IMP';
  data.voucherNo = await nextDocNumber(prefix, data.branchId);
  data.createdBy = user._id;
  const voucher = new ImportVoucher(data);
  await voucher.save();
  await log({ userId: user._id, action: 'CREATE', entity: 'ImportVoucher', entityId: voucher._id, branchId: data.branchId });
  return voucher.toObject();
};

const updateVoucher = async (id, data, user) => {
  const existing = await ImportVoucher.findById(id);
  if (!existing) throw new AppError('Import voucher not found', 404);
  Object.assign(existing, data);
  await existing.save();
  await log({ userId: user._id, action: 'UPDATE', entity: 'ImportVoucher', entityId: id });
  return existing.toObject();
};

const updateStep = async (id, stepKey, stepData, user) => {
  const voucher = await ImportVoucher.findById(id);
  if (!voucher) throw new AppError('Import voucher not found', 404);
  if (!voucher.steps) voucher.steps = new Map();
  voucher.steps.set(stepKey, { ...stepData, completedBy: user._id });
  voucher.currentStage = stepKey;
  await voucher.save();
  await log({ userId: user._id, action: 'STEP_UPDATE', entity: 'ImportVoucher', entityId: id, changes: { stepKey } });
  return voucher.toObject();
};

const addPayment = async (id, paymentData, user) => {
  const voucher = await ImportVoucher.findById(id);
  if (!voucher) throw new AppError('Import voucher not found', 404);
  voucher.payments.push(paymentData);
  await voucher.save();
  return voucher.toObject();
};

// Plans
const getPlans = async (query, user) => {
  const filter = { ...buildBranchFilter(user, query.branchId) };
  if (query.status) filter.status = query.status;
  return ImportPlan.find(filter).sort({ createdAt: -1 }).lean();
};

const createPlan = async (data, user) => {
  data.planNo = await nextDocNumber('PLN', data.branchId);
  data.createdBy = user._id;
  return ImportPlan.create(data);
};

const updatePlan = async (id, data) => {
  const plan = await ImportPlan.findByIdAndUpdate(id, data, { new: true }).lean();
  if (!plan) throw new AppError('Import plan not found', 404);
  return plan;
};

// Live tracker — returns active vouchers with stage info
const getShipments = async (query, user) => {
  const filter = { status: 'active', ...buildBranchFilter(user, query.branchId) };
  if (query.impoType) filter.impoType = query.impoType;
  return ImportVoucher.find(filter).sort({ orderDate: -1 }).lean();
};

module.exports = { getVouchers, getVoucherById, createVoucher, updateVoucher, updateStep, addPayment, getPlans, createPlan, updatePlan, getShipments };
