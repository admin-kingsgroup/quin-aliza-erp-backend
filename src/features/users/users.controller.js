const { validationResult } = require('express-validator');
const service = require('./users.service');
const { OK, CREATED, NO_CONTENT } = require('../../shared/constants/statusCodes');

const getAll = async (req, res, next) => {
  try {
    const result = await service.getAll(req.query);
    res.status(OK).json({ success: true, ...result });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const user = await service.getById(req.params.id);
    res.status(OK).json({ success: true, data: user });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const user = await service.create(req.body);
    res.status(CREATED).json({ success: true, data: user });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const user = await service.update(req.params.id, req.body);
    res.status(OK).json({ success: true, data: user });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id, req.user._id);
    res.status(NO_CONTENT).send();
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
