const service = require('./godowns.service');
const { OK, CREATED, NO_CONTENT } = require('../../../shared/constants/statusCodes');

const getAll = async (req, res, next) => {
  try {
    const data = await service.getAll(req.query);
    res.status(OK).json({ success: true, data });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    res.status(OK).json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    res.status(CREATED).json({ success: true, data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.status(OK).json({ success: true, data });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.status(NO_CONTENT).send();
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };
