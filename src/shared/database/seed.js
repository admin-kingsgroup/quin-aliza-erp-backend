require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const mongoose = require('mongoose');
const { hashPassword } = require('../utils/bcrypt');
const User = require('../../features/users/users.model');
const Role = require('../../features/roles/roles.model');
const Branch = require('../../features/branches/branches.model');
const FinanceAccount = require('../../features/finance/accounts/accounts.model');
const { ROLE_PERMISSIONS } = require('../constants/permissions');
const logger = require('../utils/logger');

const ROLES = [
  { roleId: 'role_superadmin', name: 'Super Admin', description: 'Full system access', isSystem: true, permissions: ROLE_PERMISSIONS.role_superadmin },
  { roleId: 'role_owner', name: 'Owner', description: 'Read-only overview access', isSystem: true, permissions: ROLE_PERMISSIONS.role_owner },
  { roleId: 'role_gm', name: 'General Manager', description: 'Full operational access + approvals', isSystem: true, permissions: ROLE_PERMISSIONS.role_gm },
  { roleId: 'role_accountant', name: 'Accountant', description: 'Finance and reporting access', isSystem: true, permissions: ROLE_PERMISSIONS.role_accountant },
  { roleId: 'role_branch_mgr', name: 'Branch Manager', description: 'Single branch operations', isSystem: true, permissions: ROLE_PERMISSIONS.role_branch_mgr },
  { roleId: 'role_manager', name: 'Manager', description: 'Import pipeline management', isSystem: true, permissions: ROLE_PERMISSIONS.role_manager },
];

const BRANCHES = [
  { branchCode: 'br_ho', name: 'QA-Head Office', shortName: 'HO', cargoTypes: ['HD', 'MTL', 'AIR'], branchType: 'HO', color: '#6366F1', icon: '🏢' },
  { branchCode: 'br_hd', name: 'QA-HD Texaco', shortName: 'HD', cargoTypes: ['HD', 'SEA'], branchType: 'Branch', color: '#F59E0B', icon: '⛽' },
  { branchCode: 'br_mtl', name: 'QA-MTL Texaco', shortName: 'MTL', cargoTypes: ['MTL', 'ROAD'], branchType: 'Branch', color: '#10B981', icon: '🚚' },
  { branchCode: 'br_shop1', name: 'Shop 1 - Lubumbashi', shortName: 'S1', cargoTypes: [], branchType: 'Branch', color: '#3B82F6', icon: '🏪' },
  { branchCode: 'br_shop2', name: 'Shop 2 - Kolwezi', shortName: 'S2', cargoTypes: [], branchType: 'Branch', color: '#8B5CF6', icon: '🏪' },
  { branchCode: 'br_shop3', name: 'Shop 3 - Likasi', shortName: 'S3', cargoTypes: [], branchType: 'Branch', color: '#EC4899', icon: '🏪' },
];

const CHART_OF_ACCOUNTS = [
  // Assets
  { code: '1001', name: 'Cash in Hand', group: 'Current Assets', primaryGroup: 'Assets', side: 'Debit', appearsIn: 'BS', isSystem: true },
  { code: '1002', name: 'Bank - Main Account', group: 'Current Assets', primaryGroup: 'Assets', side: 'Debit', appearsIn: 'BS', isSystem: true },
  { code: '1100', name: 'Accounts Receivable', group: 'Current Assets', primaryGroup: 'Assets', side: 'Debit', appearsIn: 'BS', isSystem: true },
  { code: '1200', name: 'Inventory / Stock', group: 'Current Assets', primaryGroup: 'Assets', side: 'Debit', appearsIn: 'BS', isSystem: true },
  { code: '1300', name: 'Prepaid Expenses', group: 'Current Assets', primaryGroup: 'Assets', side: 'Debit', appearsIn: 'BS', isSystem: false },
  { code: '1500', name: 'Fixed Assets', group: 'Non-Current Assets', primaryGroup: 'Assets', side: 'Debit', appearsIn: 'BS', isSystem: false },
  // Liabilities
  { code: '2001', name: 'Accounts Payable', group: 'Current Liabilities', primaryGroup: 'Liabilities', side: 'Credit', appearsIn: 'BS', isSystem: true },
  { code: '2100', name: 'Tax Payable', group: 'Current Liabilities', primaryGroup: 'Liabilities', side: 'Credit', appearsIn: 'BS', isSystem: true },
  { code: '2200', name: 'Salary Payable', group: 'Current Liabilities', primaryGroup: 'Liabilities', side: 'Credit', appearsIn: 'BS', isSystem: false },
  { code: '2500', name: 'Long-term Loans', group: 'Non-Current Liabilities', primaryGroup: 'Liabilities', side: 'Credit', appearsIn: 'BS', isSystem: false },
  // Equity
  { code: '3001', name: 'Owner\'s Capital', group: 'Equity', primaryGroup: 'Equity', side: 'Credit', appearsIn: 'BS', isSystem: true },
  { code: '3100', name: 'Retained Earnings', group: 'Equity', primaryGroup: 'Equity', side: 'Credit', appearsIn: 'BS', isSystem: true },
  // Revenue
  { code: '4001', name: 'Sales Revenue', group: 'Revenue', primaryGroup: 'Revenue', side: 'Credit', appearsIn: 'P&L', isSystem: true },
  { code: '4100', name: 'Import Sales', group: 'Revenue', primaryGroup: 'Revenue', side: 'Credit', appearsIn: 'P&L', isSystem: false },
  { code: '4200', name: 'Other Income', group: 'Revenue', primaryGroup: 'Revenue', side: 'Credit', appearsIn: 'P&L', isSystem: false },
  // Expenses
  { code: '5001', name: 'Cost of Goods Sold', group: 'Cost of Sales', primaryGroup: 'Expenses', side: 'Debit', appearsIn: 'P&L', isSystem: true },
  { code: '5100', name: 'Import Charges', group: 'Import Costs', primaryGroup: 'Expenses', side: 'Debit', appearsIn: 'P&L', isSystem: false },
  { code: '5200', name: 'Freight & Logistics', group: 'Import Costs', primaryGroup: 'Expenses', side: 'Debit', appearsIn: 'P&L', isSystem: false },
  { code: '5300', name: 'Salaries & Wages', group: 'Operating Expenses', primaryGroup: 'Expenses', side: 'Debit', appearsIn: 'P&L', isSystem: false },
  { code: '5400', name: 'Rent & Utilities', group: 'Operating Expenses', primaryGroup: 'Expenses', side: 'Debit', appearsIn: 'P&L', isSystem: false },
  { code: '5500', name: 'Marketing & Advertising', group: 'Operating Expenses', primaryGroup: 'Expenses', side: 'Debit', appearsIn: 'P&L', isSystem: false },
  { code: '5600', name: 'Bank Charges', group: 'Finance Costs', primaryGroup: 'Expenses', side: 'Debit', appearsIn: 'P&L', isSystem: false },
  { code: '5700', name: 'Customs & Duties', group: 'Import Costs', primaryGroup: 'Expenses', side: 'Debit', appearsIn: 'P&L', isSystem: false },
  { code: '5900', name: 'General & Admin Expenses', group: 'Operating Expenses', primaryGroup: 'Expenses', side: 'Debit', appearsIn: 'P&L', isSystem: false },
];

const seedUsers = async (branchMap) => {
  const usersData = [
    { name: 'Afshin Dhanani', email: 'afshin.dhanani@kingsgroupco.com', password: 'admin123', roleId: 'role_superadmin', businessMode: 'all', title: 'System Administrator', status: 'active' },
    { name: 'Owner', email: 'owner@quinaliza.com', password: 'owner123', roleId: 'role_owner', businessMode: 'all', title: 'Owner', status: 'active' },
    { name: 'Vipin', email: 'vipin@quinaliza.com', password: 'vipin123', roleId: 'role_gm', businessMode: 'all', title: 'General Manager', status: 'active' },
    { name: 'Nadim', email: 'nadim@quinaliza.com', password: 'nadim123', roleId: 'role_accountant', businessMode: 'all', title: 'Accountant', status: 'active' },
    { name: 'Hiren', email: 'shop1@quinaliza.com', password: 'hiren123', roleId: 'role_branch_mgr', businessMode: 'specific', businessIds: ['br_shop1'], title: 'Shop 1 Manager', status: 'active' },
    { name: 'Ravi', email: 'shop2@quinaliza.com', password: 'ravi123', roleId: 'role_branch_mgr', businessMode: 'specific', businessIds: ['br_shop2'], title: 'Shop 2 Manager', status: 'active' },
    { name: 'Opu', email: 'shop3@quinaliza.com', password: 'opu123', roleId: 'role_branch_mgr', businessMode: 'specific', businessIds: ['br_shop3'], title: 'Shop 3 Manager', status: 'active' },
    { name: 'Shamim MTL', email: 'mtl@quinaliza.com', password: 'shamim_mtl123', roleId: 'role_manager', businessMode: 'specific', businessIds: ['br_mtl'], title: 'MTL Manager', status: 'active' },
    { name: 'Shamim HD', email: 'hd@quinaliza.com', password: 'shamim_hd123', roleId: 'role_manager', businessMode: 'specific', businessIds: ['br_hd'], title: 'HD Manager', status: 'active' },
  ];
  for (const u of usersData) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      u.password = await hashPassword(u.password);
      await User.create(u);
      logger.info(`Created user: ${u.email}`);
    }
  }
};

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kbiz360');
  logger.info('Connected to MongoDB for seeding');

  // Seed roles
  for (const role of ROLES) {
    await Role.findOneAndUpdate({ roleId: role.roleId }, role, { upsert: true, new: true });
  }
  logger.info(`Seeded ${ROLES.length} roles`);

  // Seed branches
  const branchMap = {};
  for (const b of BRANCHES) {
    const branch = await Branch.findOneAndUpdate({ branchCode: b.branchCode }, b, { upsert: true, new: true });
    branchMap[b.branchCode] = String(branch._id);
  }
  logger.info(`Seeded ${BRANCHES.length} branches`);

  // Seed chart of accounts
  for (const acc of CHART_OF_ACCOUNTS) {
    await FinanceAccount.findOneAndUpdate({ code: acc.code }, acc, { upsert: true, new: true });
  }
  logger.info(`Seeded ${CHART_OF_ACCOUNTS.length} chart of accounts`);

  // Seed users
  await seedUsers(branchMap);

  logger.info('Seed completed successfully');
  await mongoose.disconnect();
};

seed().catch((err) => {
  logger.error('Seed failed:', err);
  process.exit(1);
});
