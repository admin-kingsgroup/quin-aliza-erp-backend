const { FxRate, DocSeries, FinancialYear, Notification } = require('./settings.model');
const { AppError } = require('../../shared/middleware/error.middleware');

// FX Rates
const getFxRates = () => FxRate.find().sort({ currency: 1, effectiveDate: -1 }).lean();

const getLatestFxRates = async () => {
  const pipeline = [
    { $sort: { currency: 1, effectiveDate: -1 } },
    { $group: { _id: '$currency', rate: { $first: '$rate' }, effectiveDate: { $first: '$effectiveDate' } } },
  ];
  return FxRate.aggregate(pipeline);
};

const setFxRate = async (data, user) => {
  return FxRate.create({ ...data, createdBy: user._id });
};

// Doc Series
const getDocSeries = () => DocSeries.find().sort({ module: 1 }).lean();

const updateDocSeries = async (id, data) => {
  const ds = await DocSeries.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  if (!ds) throw new AppError('Doc series not found', 404);
  return ds;
};

const resetDocSeries = async (module) => {
  return DocSeries.findOneAndUpdate({ module }, { currentNo: 0 }, { new: true }).lean();
};

// Financial Years
const getFinancialYears = () => FinancialYear.find().sort({ startDate: -1 }).lean();

const getActiveFinancialYear = () => FinancialYear.findOne({ isActive: true }).lean();

const createFinancialYear = async (data) => {
  const fy = await FinancialYear.create(data);
  if (data.isActive) {
    await FinancialYear.updateMany({ _id: { $ne: fy._id } }, { isActive: false });
  }
  return fy.toObject();
};

const updateFinancialYear = async (id, data) => {
  const fy = await FinancialYear.findByIdAndUpdate(id, data, { new: true }).lean();
  if (!fy) throw new AppError('Financial year not found', 404);
  if (data.isActive) {
    await FinancialYear.updateMany({ _id: { $ne: id } }, { isActive: false });
  }
  return fy;
};

// Notifications
const getNotifications = (userId, query) => {
  const filter = { userId };
  if (query.isRead !== undefined) filter.isRead = query.isRead === 'true';
  return Notification.find(filter).sort({ createdAt: -1 }).limit(50).lean();
};

const markNotificationsRead = (userId) =>
  Notification.updateMany({ userId, isRead: false }, { isRead: true });

const createNotification = (data) => Notification.create(data);

module.exports = {
  getFxRates, getLatestFxRates, setFxRate,
  getDocSeries, updateDocSeries, resetDocSeries,
  getFinancialYears, getActiveFinancialYear, createFinancialYear, updateFinancialYear,
  getNotifications, markNotificationsRead, createNotification,
};
