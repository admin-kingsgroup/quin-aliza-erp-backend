const { validationResult } = require('express-validator');
const service = require('./accounts.service');
const { OK, CREATED, NO_CONTENT } = require('../../../shared/constants/statusCodes');

const getAll = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.getAll(req.query) });
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
    res.status(CREATED).json({ success: true, data: await service.create(req.body) });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    res.status(OK).json({ success: true, data: await service.update(req.params.id, req.body) });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.status(NO_CONTENT).send();
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
