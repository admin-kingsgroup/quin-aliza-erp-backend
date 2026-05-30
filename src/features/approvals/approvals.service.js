const { AuditLog, ApprovalRequest } = require('./approvals.model');
const { buildPaginationMeta, parsePagination } = require('../../shared/utils/helpers');
const { AppError } = require('../../shared/middleware/error.middleware');

// Audit Log
const getAuditLog = async (query) => {
  const { page, limit } = parsePagination(query);
  const filter = {};
  if (query.entity) filter.entity = query.entity;
  if (query.entityId) filter.entityId = query.entityId;
  if (query.userId) filter.userId = query.userId;
  if (query.action) filter.action = query.action;
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to + 'T23:59:59Z');
  }
  const [logs, total] = await Promise.all([
    AuditLog.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }).populate('userId', 'name email').lean(),
    AuditLog.countDocuments(filter),
  ]);
  return { logs, meta: buildPaginationMeta(total, page, limit) };
};

// Approvals
const getPendingApprovals = async (query) => {
  const filter = { status: 'pending' };
  if (query.entityType) filter.entityType = query.entityType;
  if (query.branchId) filter.branchId = query.branchId;
  return ApprovalRequest.find(filter)
    .sort({ requestedAt: -1 })
    .populate('requestedBy', 'name email')
    .lean();
};

const getApprovalById = async (id) => {
  const req = await ApprovalRequest.findById(id).populate('requestedBy', 'name email').lean();
  if (!req) throw new AppError('Approval request not found', 404);
  return req;
};

const createApprovalRequest = async (data, user) => {
  return ApprovalRequest.create({ ...data, requestedBy: user._id });
};

const processApproval = async (id, action, notes, user) => {
  const req = await ApprovalRequest.findById(id);
  if (!req) throw new AppError('Approval request not found', 404);
  if (req.status !== 'pending') throw new AppError('Request already processed', 400);
  req.status = action;
  req.approvedBy = user._id;
  req.approvedAt = new Date();
  if (notes) {
    if (action === 'rejected') req.rejectionReason = notes;
    else req.notes = notes;
  }
  await req.save();
  return req.toObject();
};

module.exports = { getAuditLog, getPendingApprovals, getApprovalById, createApprovalRequest, processApproval };
