const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { errorHandler, notFound } = require('./shared/middleware/error.middleware');

// Feature routes
const authRoutes = require('./features/auth/auth.route');
const usersRoutes = require('./features/users/users.route');
const rolesRoutes = require('./features/roles/roles.route');
const branchesRoutes = require('./features/branches/branches.route');
const itemsRoutes = require('./features/masters/items/items.route');
const customersRoutes = require('./features/masters/customers/customers.route');
const suppliersRoutes = require('./features/masters/suppliers/suppliers.route');
const godownsRoutes = require('./features/masters/godowns/godowns.route');
const itemCategoriesRoutes = require('./features/masters/item-categories/item-categories.route');
const taxCodesRoutes = require('./features/masters/tax-codes/tax-codes.route');
const costCentresRoutes = require('./features/masters/cost-centres/cost-centres.route');
const bankAccountsRoutes = require('./features/masters/bank-accounts/bank-accounts.route');
const priceListsRoutes = require('./features/masters/price-lists/price-lists.route');
const finAccountsRoutes = require('./features/finance/accounts/accounts.route');
const finVouchersRoutes = require('./features/finance/vouchers/vouchers.route');
const finReportsRoutes = require('./features/finance/reports/finReports.route');
const salesRoutes = require('./features/sales/sales.route');
const purchaseRoutes = require('./features/purchase/purchase.route');
const inventoryRoutes = require('./features/inventory/inventory.route');
const importsRoutes = require('./features/imports/imports.route');
const hrRoutes = require('./features/hr/hr.route');
const reportsRoutes = require('./features/reports/reports.route');
const settingsRoutes = require('./features/settings/settings.route');
const approvalsRoutes = require('./features/approvals/approvals.route');

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Global rate limiter
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false }));

// Auth rate limiter (stricter)
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/branches', branchesRoutes);
app.use('/api/masters/items', itemsRoutes);
app.use('/api/masters/customers', customersRoutes);
app.use('/api/masters/suppliers', suppliersRoutes);
app.use('/api/masters/godowns', godownsRoutes);
app.use('/api/masters/item-categories', itemCategoriesRoutes);
app.use('/api/masters/tax-codes', taxCodesRoutes);
app.use('/api/masters/cost-centres', costCentresRoutes);
app.use('/api/masters/bank-accounts', bankAccountsRoutes);
app.use('/api/masters/price-lists', priceListsRoutes);
app.use('/api/finance/accounts', finAccountsRoutes);
app.use('/api/finance/vouchers', finVouchersRoutes);
app.use('/api/finance/reports', finReportsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/imports', importsRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/approvals', approvalsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
