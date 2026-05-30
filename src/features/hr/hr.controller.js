const service = require('./hr.service');
const { OK, CREATED } = require('../../shared/constants/statusCodes');

// Staff
const getAllStaff = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, ...(await service.getAllStaff(req.query, req.user)) });
  } catch (err) { next(err); }
};

const getStaffById = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getStaffById(req.params.id) });
  } catch (err) { next(err); }
};

const createStaff = async (req, res, next) => {
  try {
    res.status(CREATED).json({ success: true, data: await service.createStaff(req.body, req.user) });
  } catch (err) { next(err); }
};

const updateStaff = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.updateStaff(req.params.id, req.body, req.user) });
  } catch (err) { next(err); }
};

// Attendance
const getAttendance = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getAttendance(req.query, req.user) });
  } catch (err) { next(err); }
};

const markAttendance = async (req, res, next) => {
  try {
    const records = Array.isArray(req.body) ? req.body : [req.body];
    await service.markAttendance(records, req.user);
    res.status(OK).json({ success: true, message: 'Attendance marked' });
  } catch (err) { next(err); }
};

// Leave
const getLeaveRequests = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getLeaveRequests(req.query, req.user) });
  } catch (err) { next(err); }
};

const createLeaveRequest = async (req, res, next) => {
  try {
    res.status(CREATED).json({ success: true, data: await service.createLeaveRequest(req.body, req.user) });
  } catch (err) { next(err); }
};

const approveLeave = async (req, res, next) => {
  try {
    const action = req.params.action; // 'approved' or 'rejected'
    res.status(OK).json({ success: true, data: await service.approveLeave(req.params.id, action, req.user) });
  } catch (err) { next(err); }
};

// Payroll
const getPayrollRuns = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getPayrollRuns(req.query, req.user) });
  } catch (err) { next(err); }
};

const runPayroll = async (req, res, next) => {
  try {
    res.status(CREATED).json({ success: true, data: await service.runPayroll(req.body, req.user) });
  } catch (err) { next(err); }
};

const getPayrollById = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getPayrollById(req.params.id) });
  } catch (err) { next(err); }
};

// Leave Types & Components
const getLeaveTypes = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getLeaveTypes() });
  } catch (err) { next(err); }
};

const createLeaveType = async (req, res, next) => {
  try {
    res.status(CREATED).json({ success: true, data: await service.createLeaveType(req.body) });
  } catch (err) { next(err); }
};

const getPayrollComponents = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getPayrollComponents() });
  } catch (err) { next(err); }
};

const createPayrollComponent = async (req, res, next) => {
  try {
    res.status(CREATED).json({ success: true, data: await service.createPayrollComponent(req.body) });
  } catch (err) { next(err); }
};

// Advances
const getAdvances = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getAdvances(req.query, req.user) });
  } catch (err) { next(err); }
};

const createAdvance = async (req, res, next) => {
  try {
    res.status(CREATED).json({ success: true, data: await service.createAdvance(req.body) });
  } catch (err) { next(err); }
};

const updateAdvance = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.updateAdvance(req.params.id, req.body) });
  } catch (err) { next(err); }
};

module.exports = {
  getAllStaff, getStaffById, createStaff, updateStaff,
  getAttendance, markAttendance,
  getLeaveRequests, createLeaveRequest, approveLeave,
  getPayrollRuns, runPayroll, getPayrollById,
  getLeaveTypes, createLeaveType,
  getPayrollComponents, createPayrollComponent,
  getAdvances, createAdvance, updateAdvance,
};
