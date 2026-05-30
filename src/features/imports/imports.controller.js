const service = require('./imports.service');
const { OK, CREATED } = require('../../shared/constants/statusCodes');

const getVouchers = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, ...(await service.getVouchers(req.query, req.user)) });
  } catch (err) { next(err); }
};

const getVoucherById = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getVoucherById(req.params.id) });
  } catch (err) { next(err); }
};

const createVoucher = async (req, res, next) => {
  try {
    res.status(CREATED).json({ success: true, data: await service.createVoucher(req.body, req.user) });
  } catch (err) { next(err); }
};

const updateVoucher = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.updateVoucher(req.params.id, req.body, req.user) });
  } catch (err) { next(err); }
};

const updateStep = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.updateStep(req.params.id, req.params.stepKey, req.body, req.user) });
  } catch (err) { next(err); }
};

const addPayment = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.addPayment(req.params.id, req.body, req.user) });
  } catch (err) { next(err); }
};

const getPlans = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getPlans(req.query, req.user) });
  } catch (err) { next(err); }
};

const createPlan = async (req, res, next) => {
  try {
    res.status(CREATED).json({ success: true, data: await service.createPlan(req.body, req.user) });
  } catch (err) { next(err); }
};

const updatePlan = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.updatePlan(req.params.id, req.body) });
  } catch (err) { next(err); }
};

const getShipments = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getShipments(req.query, req.user) });
  } catch (err) { next(err); }
};

module.exports = { getVouchers, getVoucherById, createVoucher, updateVoucher, updateStep, addPayment, getPlans, createPlan, updatePlan, getShipments };
