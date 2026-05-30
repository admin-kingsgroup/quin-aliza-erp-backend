const SalesOrder = require('../sales/sales.model');
const PurchaseOrder = require('../purchase/purchase.model');
const StockMovement = require('../inventory/inventory.model');
const FinanceVoucher = require('../finance/vouchers/vouchers.model');
const { buildBranchFilter } = require('../../shared/utils/helpers');

const getMISSummary = async (query, user) => {
  const branchFilter = buildBranchFilter(user, query.branchId);
  const dateFilter = {};
  if (query.from) dateFilter.$gte = new Date(query.from);
  if (query.to) dateFilter.$lte = new Date(query.to + 'T23:59:59Z');
  const filter = { ...branchFilter, status: { $ne: 'cancelled' } };
  if (Object.keys(dateFilter).length) filter.date = dateFilter;

  const [salesTotal, purchaseTotal, stockIn, stockOut] = await Promise.all([
    SalesOrder.aggregate([{ $match: filter }, { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }]),
    PurchaseOrder.aggregate([{ $match: filter }, { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }]),
    StockMovement.aggregate([{ $match: { ...filter, type: 'in' } }, { $unwind: '$lines' }, { $group: { _id: null, qty: { $sum: '$lines.qty' } } }]),
    StockMovement.aggregate([{ $match: { ...filter, type: 'out' } }, { $unwind: '$lines' }, { $group: { _id: null, qty: { $sum: '$lines.qty' } } }]),
  ]);

  return {
    sales: { total: salesTotal[0]?.total || 0, count: salesTotal[0]?.count || 0 },
    purchases: { total: purchaseTotal[0]?.total || 0, count: purchaseTotal[0]?.count || 0 },
    inventory: { inQty: stockIn[0]?.qty || 0, outQty: stockOut[0]?.qty || 0 },
  };
};

const getSalesTrend = async (query, user) => {
  const branchFilter = buildBranchFilter(user, query.branchId);
  const pipeline = [
    {
      $match: { status: { $ne: 'cancelled' }, ...branchFilter },
    },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        totalSales: { $sum: '$totalAmount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ];
  return SalesOrder.aggregate(pipeline);
};

const getItemProfitability = async (query, user) => {
  const branchFilter = buildBranchFilter(user, query.branchId);
  const pipeline = [
    { $match: { status: { $ne: 'cancelled' }, ...branchFilter } },
    { $unwind: '$lines' },
    {
      $group: {
        _id: '$lines.itemId',
        itemName: { $first: '$lines.itemName' },
        totalRevenue: { $sum: { $multiply: ['$lines.qty', '$lines.rate'] } },
        totalQty: { $sum: '$lines.qty' },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: parseInt(query.limit) || 50 },
  ];
  return SalesOrder.aggregate(pipeline);
};

const getBranchComparison = async (user) => {
  const pipeline = [
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: '$branchId', totalSales: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
    { $lookup: { from: 'branches', localField: '_id', foreignField: '_id', as: 'branch' } },
    { $unwind: { path: '$branch', preserveNullAndEmptyArrays: true } },
  ];
  return SalesOrder.aggregate(pipeline);
};

module.exports = { getMISSummary, getSalesTrend, getItemProfitability, getBranchComparison };
