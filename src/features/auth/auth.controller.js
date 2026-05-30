const { validationResult } = require('express-validator');
const authService = require('./auth.service');
const { OK } = require('../../shared/constants/statusCodes');

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const result = await authService.login(req.body);
    res.status(OK).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const result = await authService.refresh(req.body);
    res.status(OK).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.status(OK).json({ success: true, message: 'Logged out successfully' });
};

const me = async (req, res, next) => {
  try {
    const user = await authService.me(req.user._id);
    res.status(OK).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, refresh, logout, me };
