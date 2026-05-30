const service = require('./finReports.service');
const { OK } = require('../../../shared/constants/statusCodes');

const getTrialBalance = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getTrialBalance(req.query) });
  } catch (err) { next(err); }
};

const getPL = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getPL(req.query) });
  } catch (err) { next(err); }
};

const getBalanceSheet = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getBalanceSheet(req.query) });
  } catch (err) { next(err); }
};

const getAR = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getAR(req.query) });
  } catch (err) { next(err); }
};

const getAP = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getAP(req.query) });
  } catch (err) { next(err); }
};

const getCashBook = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getCashBook(req.query) });
  } catch (err) { next(err); }
};

module.exports = { getTrialBalance, getPL, getBalanceSheet, getAR, getAP, getCashBook };
