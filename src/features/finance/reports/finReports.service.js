const FinanceVoucher = require('../vouchers/vouchers.model');
const FinanceAccount = require('../accounts/accounts.model');

const buildBalances = async (branchFilter, dateFilter) => {
  const pipeline = [
    { $match: { status: { $ne: 'cancelled' }, ...branchFilter, ...dateFilter } },
    { $unwind: '$lines' },
    {
      $group: {
        _id: '$lines.accountId',
        totalDebit: { $sum: '$lines.debit' },
        totalCredit: { $sum: '$lines.credit' },
      },
    },
  ];
  const balances = await FinanceVoucher.aggregate(pipeline);
  const accounts = await FinanceAccount.find().lean();
  const accountMap = Object.fromEntries(accounts.map((a) => [String(a._id), a]));
  return balances.map((b) => ({
    ...b,
    account: accountMap[String(b._id)],
    net: (b.totalDebit || 0) - (b.totalCredit || 0),
  }));
};

const getTrialBalance = async (query) => {
  const branchFilter = query.branchId ? { branchId: query.branchId } : {};
  const dateFilter = {};
  if (query.from) dateFilter['date'] = { ...(dateFilter.date || {}), $gte: new Date(query.from) };
  if (query.to) dateFilter['date'] = { ...(dateFilter.date || {}), $lte: new Date(query.to + 'T23:59:59Z') };
  const balances = await buildBalances(branchFilter, dateFilter);
  return balances.sort((a, b) => (a.account?.name || '').localeCompare(b.account?.name || ''));
};

const getPL = async (query) => {
  const branchFilter = query.branchId ? { branchId: query.branchId } : {};
  const dateFilter = {};
  if (query.from) dateFilter['date'] = { $gte: new Date(query.from) };
  if (query.to) dateFilter['date'] = { ...(dateFilter.date || {}), $lte: new Date(query.to + 'T23:59:59Z') };
  const balances = await buildBalances(branchFilter, dateFilter);
  const revenue = balances.filter((b) => b.account?.primaryGroup === 'Revenue');
  const expenses = balances.filter((b) => b.account?.primaryGroup === 'Expenses');
  const totalRevenue = revenue.reduce((s, b) => s + (b.totalCredit - b.totalDebit), 0);
  const totalExpenses = expenses.reduce((s, b) => s + (b.totalDebit - b.totalCredit), 0);
  return { revenue, expenses, totalRevenue, totalExpenses, netProfit: totalRevenue - totalExpenses };
};

const getBalanceSheet = async (query) => {
  const branchFilter = query.branchId ? { branchId: query.branchId } : {};
  const dateFilter = query.asOf ? { date: { $lte: new Date(query.asOf + 'T23:59:59Z') } } : {};
  const balances = await buildBalances(branchFilter, dateFilter);
  const assets = balances.filter((b) => b.account?.primaryGroup === 'Assets');
  const liabilities = balances.filter((b) => b.account?.primaryGroup === 'Liabilities');
  const equity = balances.filter((b) => b.account?.primaryGroup === 'Equity');
  return { assets, liabilities, equity };
};

const getAR = async (query) => {
  const filter = { vType: { $in: ['creditsale', 'sales'] }, status: { $ne: 'cancelled' } };
  if (query.branchId) filter.branchId = query.branchId;
  const vouchers = await FinanceVoucher.find(filter).sort({ date: -1 }).lean();
  // Group by party
  const parties = {};
  vouchers.forEach((v) => {
    if (!v.partyId) return;
    const key = String(v.partyId);
    if (!parties[key]) parties[key] = { party: v.party, partyId: v.partyId, outstanding: 0, vouchers: [] };
    parties[key].outstanding += v.totalDebit - v.totalCredit;
    parties[key].vouchers.push(v);
  });
  return Object.values(parties);
};

const getAP = async (query) => {
  const filter = { vType: { $in: ['purchase'] }, status: { $ne: 'cancelled' } };
  if (query.branchId) filter.branchId = query.branchId;
  const vouchers = await FinanceVoucher.find(filter).sort({ date: -1 }).lean();
  const parties = {};
  vouchers.forEach((v) => {
    if (!v.partyId) return;
    const key = String(v.partyId);
    if (!parties[key]) parties[key] = { party: v.party, partyId: v.partyId, outstanding: 0, vouchers: [] };
    parties[key].outstanding += v.totalCredit - v.totalDebit;
    parties[key].vouchers.push(v);
  });
  return Object.values(parties);
};

const getCashBook = async (query) => {
  const filter = { vType: { $in: ['cashsale', 'payment', 'receipt', 'contra', 'expense'] }, status: { $ne: 'cancelled' } };
  if (query.branchId) filter.branchId = query.branchId;
  if (query.from) filter.date = { $gte: new Date(query.from) };
  if (query.to) filter.date = { ...(filter.date || {}), $lte: new Date(query.to + 'T23:59:59Z') };
  return FinanceVoucher.find(filter).sort({ date: 1 }).lean();
};

module.exports = { getTrialBalance, getPL, getBalanceSheet, getAR, getAP, getCashBook };
