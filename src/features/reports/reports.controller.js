const service = require('./reports.service');
const { OK } = require('../../shared/constants/statusCodes');

const getMISSummary = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getMISSummary(req.query, req.user) });
  } catch (err) { next(err); }
};

const getSalesTrend = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getSalesTrend(req.query, req.user) });
  } catch (err) { next(err); }
};

const getItemProfitability = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getItemProfitability(req.query, req.user) });
  } catch (err) { next(err); }
};

const getBranchComparison = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getBranchComparison(req.user) });
  } catch (err) { next(err); }
};

module.exports = { getMISSummary, getSalesTrend, getItemProfitability, getBranchComparison };
