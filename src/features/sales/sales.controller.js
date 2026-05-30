const { validationResult } = require('express-validator');
const service = require('./sales.service');
const { OK, CREATED } = require('../../shared/constants/statusCodes');

const getAll = async (req, res, next) => {
  try {
    const result = await service.getAll(req.query, req.user);
    res.status(OK).json({ success: true, ...result });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getById(req.params.id) });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    res.status(CREATED).json({ success: true, data: await service.create(req.body, req.user) });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.update(req.params.id, req.body, req.user) });
  } catch (err) { next(err); }
};

const cancel = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.cancel(req.params.id, req.user) });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, cancel };
