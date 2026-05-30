const mongoose = require('mongoose');

// Staff Master
const staffSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String },
    designation: { type: String },
    department: { type: String },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    doj: { type: Date },
    dob: { type: Date },
    salary: { type: Number, default: 0 },
    bankAccount: { type: String },
    bankName: { type: String },
    emergencyContact: { type: String },
    address: { type: String },
    nationalId: { type: String },
    status: { type: String, enum: ['active', 'inactive', 'on_leave', 'terminated'], default: 'active' },
  },
  { timestamps: true }
);

// Attendance
const attendanceSchema = new mongoose.Schema(
  {
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'half_day', 'leave', 'holiday'], default: 'present' },
    checkIn: { type: String },
    checkOut: { type: String },
    hoursWorked: { type: Number },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    remarks: { type: String },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
attendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ branchId: 1, date: -1 });

// Leave Types
const leaveTypeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  daysAllowed: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
});

// Leave Requests
const leaveRequestSchema = new mongoose.Schema(
  {
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    leaveTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'LeaveType' },
    leaveType: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number },
    reason: { type: String },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    notes: { type: String },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  },
  { timestamps: true }
);

// Payroll Components
const payrollComponentSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['earning', 'deduction'], required: true },
  isFixed: { type: Boolean, default: true },
  amount: { type: Number, default: 0 },
  isTaxable: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

// Payroll Run
const payrollRecordSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  staffName: String,
  baseSalary: { type: Number, default: 0 },
  earnings: [{ componentId: mongoose.Schema.Types.ObjectId, name: String, amount: Number }],
  deductions: [{ componentId: mongoose.Schema.Types.ObjectId, name: String, amount: Number }],
  grossSalary: { type: Number, default: 0 },
  totalDeductions: { type: Number, default: 0 },
  netSalary: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'processed', 'paid'], default: 'processed' },
  paidDate: Date,
});

const payrollRunSchema = new mongoose.Schema(
  {
    runNo: { type: String, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    records: [payrollRecordSchema],
    totalGross: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    totalNet: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'processed', 'paid', 'cancelled'], default: 'processed' },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Salary Advance
const salaryAdvanceSchema = new mongoose.Schema(
  {
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    deductMonths: { type: Number, default: 1 },
    reason: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'recovered'], default: 'pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  },
  { timestamps: true }
);

module.exports = {
  Staff: mongoose.model('Staff', staffSchema),
  Attendance: mongoose.model('Attendance', attendanceSchema),
  LeaveType: mongoose.model('LeaveType', leaveTypeSchema),
  LeaveRequest: mongoose.model('LeaveRequest', leaveRequestSchema),
  PayrollComponent: mongoose.model('PayrollComponent', payrollComponentSchema),
  PayrollRun: mongoose.model('PayrollRun', payrollRunSchema),
  SalaryAdvance: mongoose.model('SalaryAdvance', salaryAdvanceSchema),
};
