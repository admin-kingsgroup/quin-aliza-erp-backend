const router = require('express').Router();
const c = require('./hr.controller');
const { authenticate, authorize } = require('../../shared/middleware/auth.middleware');
const { PERMISSIONS } = require('../../shared/constants/permissions');

router.use(authenticate);

// Staff
router.get('/staff', authorize(PERMISSIONS.HR_READ), c.getAllStaff);
router.get('/staff/:id', authorize(PERMISSIONS.HR_READ), c.getStaffById);
router.post('/staff', authorize(PERMISSIONS.HR_WRITE), c.createStaff);
router.put('/staff/:id', authorize(PERMISSIONS.HR_WRITE), c.updateStaff);

// Attendance
router.get('/attendance', authorize(PERMISSIONS.HR_READ), c.getAttendance);
router.post('/attendance', authorize(PERMISSIONS.HR_WRITE), c.markAttendance);

// Leave
router.get('/leave', authorize(PERMISSIONS.HR_READ), c.getLeaveRequests);
router.post('/leave', authorize(PERMISSIONS.HR_READ), c.createLeaveRequest);
router.post('/leave/:id/:action', authorize(PERMISSIONS.HR_APPROVE), c.approveLeave);

// Payroll
router.get('/payroll', authorize(PERMISSIONS.HR_READ), c.getPayrollRuns);
router.post('/payroll/run', authorize(PERMISSIONS.HR_WRITE), c.runPayroll);
router.get('/payroll/:id', authorize(PERMISSIONS.HR_READ), c.getPayrollById);

// Leave types
router.get('/leave-types', authorize(PERMISSIONS.HR_READ), c.getLeaveTypes);
router.post('/leave-types', authorize(PERMISSIONS.HR_WRITE), c.createLeaveType);

// Payroll components
router.get('/payroll-components', authorize(PERMISSIONS.HR_READ), c.getPayrollComponents);
router.post('/payroll-components', authorize(PERMISSIONS.HR_WRITE), c.createPayrollComponent);

// Salary advances
router.get('/advances', authorize(PERMISSIONS.HR_READ), c.getAdvances);
router.post('/advances', authorize(PERMISSIONS.HR_WRITE), c.createAdvance);
router.put('/advances/:id', authorize(PERMISSIONS.HR_APPROVE), c.updateAdvance);

module.exports = router;
