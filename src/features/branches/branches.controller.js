const { validationResult } = require('express-validator');
const service = require('./branches.service');
const { OK, CREATED, NO_CONTENT } = require('../../shared/constants/statusCodes');

const getAll = async (req, res, next) => {
  try {
    const branches = await service.getAll(req.query, req.user);
    res.status(OK).json({ success: true, data: branches });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const branch = await service.getById(req.params.id);
    res.status(OK).json({ success: true, data: branch });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const branch = await service.create(req.body);
    res.status(CREATED).json({ success: true, data: branch });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const branch = await service.update(req.params.id, req.body);
    res.status(OK).json({ success: true, data: branch });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.status(NO_CONTENT).send();
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
