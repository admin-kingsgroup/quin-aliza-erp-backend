const service = require('./approvals.service');
const { OK, CREATED } = require('../../shared/constants/statusCodes');

const getAuditLog = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, ...(await service.getAuditLog(req.query)) });
  } catch (err) { next(err); }
};

const getPendingApprovals = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getPendingApprovals(req.query) });
  } catch (err) { next(err); }
};

const getApprovalById = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getApprovalById(req.params.id) });
  } catch (err) { next(err); }
};

const createApprovalRequest = async (req, res, next) => {
  try {
    res.status(CREATED).json({ success: true, data: await service.createApprovalRequest(req.body, req.user) });
  } catch (err) { next(err); }
};

const processApproval = async (req, res, next) => {
  try {
    const { action, notes } = req.body;
    if (!['approved', 'rejected'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Action must be approved or rejected' });
    }
    res.status(OK).json({ success: true, data: await service.processApproval(req.params.id, action, notes, req.user) });
  } catch (err) { next(err); }
};

module.exports = { getAuditLog, getPendingApprovals, getApprovalById, createApprovalRequest, processApproval };
