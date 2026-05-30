const StockMovement = require('./inventory.model');
const Item = require('../masters/items/items.model');
const { buildPaginationMeta, parsePagination, buildBranchFilter } = require('../../shared/utils/helpers');
const { nextDocNumber } = require('../../shared/utils/docSeries');
const { AppError } = require('../../shared/middleware/error.middleware');
const { log } = require('../../shared/utils/auditLog');

const getMovements = async (query, user) => {
  const { page, limit } = parsePagination(query);
  const filter = { ...buildBranchFilter(user, query.branchId) };
  if (query.type) filter.type = query.type;
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = new Date(query.from);
    if (query.to) filter.date.$lte = new Date(query.to + 'T23:59:59Z');
  }
  const [movements, total] = await Promise.all([
    StockMovement.find(filter).skip((page - 1) * limit).limit(limit).sort({ date: -1 }).lean(),
    StockMovement.countDocuments(filter),
  ]);
  return { movements, meta: buildPaginationMeta(total, page, limit) };
};

const createMovement = async (data, user) => {
  const typePrefix = { in: 'GRN', out: 'GIN', transfer: 'TRF', adjustment: 'ADJ' };
  data.docNo = await nextDocNumber(typePrefix[data.type] || 'MOV', data.branchId);
  data.createdBy = user._id;
  const movement = await StockMovement.create(data);
  await log({ userId: user._id, action: 'CREATE', entity: 'StockMovement', entityId: movement._id, branchId: data.branchId });
  return movement.toObject();
};

const getStockSummary = async (query, user) => {
  const branchFilter = buildBranchFilter(user, query.branchId);
  const matchFilter = { status: 'confirmed', ...branchFilter };
  const pipeline = [
    { $match: matchFilter },
    { $unwind: '$lines' },
    {
      $group: {
        _id: { itemId: '$lines.itemId', branchId: '$branchId', type: '$type' },
        totalQty: { $sum: '$lines.qty' },
        avgRate: { $avg: '$lines.rate' },
      },
    },
    {
      $group: {
        _id: { itemId: '$_id.itemId', branchId: '$_id.branchId' },
        inQty: { $sum: { $cond: [{ $eq: ['$_id.type', 'in'] }, '$totalQty', 0] } },
        outQty: { $sum: { $cond: [{ $eq: ['$_id.type', 'out'] }, '$totalQty', 0] } },
        adjustQty: { $sum: { $cond: [{ $eq: ['$_id.type', 'adjustment'] }, '$totalQty', 0] } },
      },
    },
    {
      $addFields: { netQty: { $subtract: [{ $add: ['$inQty', '$adjustQty'] }, '$outQty'] } },
    },
    { $lookup: { from: 'items', localField: '_id.itemId', foreignField: '_id', as: 'item' } },
    { $unwind: { path: '$item', preserveNullAndEmptyArrays: true } },
  ];
  const results = await StockMovement.aggregate(pipeline);
  return results.map((r) => ({
    itemId: r._id.itemId,
    branchId: r._id.branchId,
    itemCode: r.item?.code,
    itemName: r.item?.name,
    unit: r.item?.unit,
    inQty: r.inQty,
    outQty: r.outQty,
    netQty: r.netQty,
    reorderLevel: r.item?.reorderLevel,
    isLowStock: r.netQty <= (r.item?.reorderLevel || 0),
  }));
};

module.exports = { getMovements, createMovement, getStockSummary };
