const service = require('./settings.service');
const { OK, CREATED } = require('../../shared/constants/statusCodes');

const getFxRates = async (req, res, next) => {
  try {
    const data = req.query.latest === 'true' ? await service.getLatestFxRates() : await service.getFxRates();
    res.status(OK).json({ success: true, data });
  } catch (err) { next(err); }
};

const setFxRate = async (req, res, next) => {
  try {
    res.status(CREATED).json({ success: true, data: await service.setFxRate(req.body, req.user) });
  } catch (err) { next(err); }
};

const getDocSeries = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getDocSeries() });
  } catch (err) { next(err); }
};

const updateDocSeries = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.updateDocSeries(req.params.id, req.body) });
  } catch (err) { next(err); }
};

const getFinancialYears = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getFinancialYears() });
  } catch (err) { next(err); }
};

const createFinancialYear = async (req, res, next) => {
  try {
    res.status(CREATED).json({ success: true, data: await service.createFinancialYear(req.body) });
  } catch (err) { next(err); }
};

const updateFinancialYear = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.updateFinancialYear(req.params.id, req.body) });
  } catch (err) { next(err); }
};

const getNotifications = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getNotifications(req.user._id, req.query) });
  } catch (err) { next(err); }
};

const markNotificationsRead = async (req, res, next) => {
  try {
    await service.markNotificationsRead(req.user._id);
    res.status(OK).json({ success: true, message: 'Notifications marked as read' });
  } catch (err) { next(err); }
};

module.exports = {
  getFxRates, setFxRate,
  getDocSeries, updateDocSeries,
  getFinancialYears, createFinancialYear, updateFinancialYear,
  getNotifications, markNotificationsRead,
};
