const { Staff, Attendance, LeaveType, LeaveRequest, PayrollComponent, PayrollRun, SalaryAdvance } = require('./hr.model');
const { buildPaginationMeta, parsePagination, buildBranchFilter } = require('../../shared/utils/helpers');
const { nextDocNumber } = require('../../shared/utils/docSeries');
const { AppError } = require('../../shared/middleware/error.middleware');
const { log } = require('../../shared/utils/auditLog');

// Staff
const getAllStaff = async (query, user) => {
  const { page, limit } = parsePagination(query);
  const filter = { ...buildBranchFilter(user, query.branchId) };
  if (query.status) filter.status = query.status;
  if (query.department) filter.department = query.department;
  const [staff, total] = await Promise.all([
    Staff.find(filter).skip((page - 1) * limit).limit(limit).sort({ name: 1 }).lean(),
    Staff.countDocuments(filter),
  ]);
  return { staff, meta: buildPaginationMeta(total, page, limit) };
};

const getStaffById = async (id) => {
  const s = await Staff.findById(id).lean();
  if (!s) throw new AppError('Staff not found', 404);
  return s;
};

const createStaff = async (data, user) => {
  if (!data.employeeId) {
    data.employeeId = await nextDocNumber('EMP', data.branchId);
  }
  const staff = await Staff.create(data);
  await log({ userId: user._id, action: 'CREATE', entity: 'Staff', entityId: staff._id });
  return staff.toObject();
};

const updateStaff = async (id, data, user) => {
  const s = await Staff.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  if (!s) throw new AppError('Staff not found', 404);
  await log({ userId: user._id, action: 'UPDATE', entity: 'Staff', entityId: id });
  return s;
};

// Attendance
const getAttendance = async (query, user) => {
  const filter = { ...buildBranchFilter(user, query.branchId) };
  if (query.staffId) filter.staffId = query.staffId;
  if (query.date) filter.date = new Date(query.date);
  if (query.month && query.year) {
    const start = new Date(query.year, query.month - 1, 1);
    const end = new Date(query.year, query.month, 0);
    filter.date = { $gte: start, $lte: end };
  }
  return Attendance.find(filter).sort({ date: -1 }).lean();
};

const markAttendance = async (records, user) => {
  const ops = records.map((r) => ({
    updateOne: {
      filter: { staffId: r.staffId, date: new Date(r.date) },
      update: { $set: { ...r, markedBy: user._id } },
      upsert: true,
    },
  }));
  return Attendance.bulkWrite(ops);
};

// Leave
const getLeaveRequests = async (query, user) => {
  const filter = { ...buildBranchFilter(user, query.branchId) };
  if (query.staffId) filter.staffId = query.staffId;
  if (query.approvalStatus) filter.approvalStatus = query.approvalStatus;
  return LeaveRequest.find(filter).sort({ createdAt: -1 }).lean();
};

const createLeaveRequest = async (data, user) => {
  const days = Math.ceil((new Date(data.endDate) - new Date(data.startDate)) / (1000 * 60 * 60 * 24)) + 1;
  return LeaveRequest.create({ ...data, days });
};

const approveLeave = async (id, action, user) => {
  const leave = await LeaveRequest.findByIdAndUpdate(
    id,
    { approvalStatus: action, approvedBy: user._id, approvedAt: new Date() },
    { new: true }
  ).lean();
  if (!leave) throw new AppError('Leave request not found', 404);
  await log({ userId: user._id, action: `LEAVE_${action.toUpperCase()}`, entity: 'LeaveRequest', entityId: id });
  return leave;
};

// Payroll
const getPayrollRuns = async (query, user) => {
  const filter = { ...buildBranchFilter(user, query.branchId) };
  if (query.month) filter.month = parseInt(query.month);
  if (query.year) filter.year = parseInt(query.year);
  return PayrollRun.find(filter).sort({ year: -1, month: -1 }).lean();
};

const runPayroll = async (data, user) => {
  const { branchId, month, year, staffIds } = data;
  const staffFilter = { status: 'active' };
  if (branchId) staffFilter.branchId = branchId;
  if (staffIds?.length) staffFilter._id = { $in: staffIds };
  const allStaff = await Staff.find(staffFilter).lean();

  const records = allStaff.map((s) => ({
    staffId: s._id,
    staffName: s.name,
    baseSalary: s.salary || 0,
    earnings: [],
    deductions: [],
    grossSalary: s.salary || 0,
    totalDeductions: 0,
    netSalary: s.salary || 0,
    status: 'processed',
  }));

  const totalGross = records.reduce((sum, r) => sum + r.grossSalary, 0);
  const totalNet = records.reduce((sum, r) => sum + r.netSalary, 0);

  const runNo = await nextDocNumber('PAY', branchId);
  const run = await PayrollRun.create({ runNo, month, year, branchId, records, totalGross, totalDeductions: 0, totalNet, createdBy: user._id });
  await log({ userId: user._id, action: 'PAYROLL_RUN', entity: 'PayrollRun', entityId: run._id });
  return run.toObject();
};

const getPayrollById = async (id) => {
  const run = await PayrollRun.findById(id).lean();
  if (!run) throw new AppError('Payroll run not found', 404);
  return run;
};

// Leave Types and Payroll Components
const getLeaveTypes = () => LeaveType.find().sort({ name: 1 }).lean();
const createLeaveType = (data) => LeaveType.create(data);
const getPayrollComponents = () => PayrollComponent.find().sort({ name: 1 }).lean();
const createPayrollComponent = (data) => PayrollComponent.create(data);

// Salary Advances
const getAdvances = (query, user) => {
  const filter = { ...buildBranchFilter(user, query.branchId) };
  if (query.staffId) filter.staffId = query.staffId;
  return SalaryAdvance.find(filter).sort({ date: -1 }).lean();
};
const createAdvance = (data) => SalaryAdvance.create(data);
const updateAdvance = (id, data) => SalaryAdvance.findByIdAndUpdate(id, data, { new: true }).lean();

module.exports = {
  getAllStaff, getStaffById, createStaff, updateStaff,
  getAttendance, markAttendance,
  getLeaveRequests, createLeaveRequest, approveLeave,
  getPayrollRuns, runPayroll, getPayrollById,
  getLeaveTypes, createLeaveType,
  getPayrollComponents, createPayrollComponent,
  getAdvances, createAdvance, updateAdvance,
};
