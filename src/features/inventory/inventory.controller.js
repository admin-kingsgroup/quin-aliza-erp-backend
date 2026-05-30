const service = require('./inventory.service');
const { OK, CREATED } = require('../../shared/constants/statusCodes');

const getMovements = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, ...(await service.getMovements(req.query, req.user)) });
  } catch (err) { next(err); }
};

const createMovement = async (req, res, next) => {
  try {
    res.status(CREATED).json({ success: true, data: await service.createMovement(req.body, req.user) });
  } catch (err) { next(err); }
};

const getStockSummary = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getStockSummary(req.query, req.user) });
  } catch (err) { next(err); }
};

module.exports = { getMovements, createMovement, getStockSummary };
