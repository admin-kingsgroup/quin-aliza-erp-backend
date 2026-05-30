const User = require('../users/users.model');
const { comparePassword } = require('../../shared/utils/bcrypt');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../shared/utils/jwt');
const { AppError } = require('../../shared/middleware/error.middleware');
const { toAuthResponse } = require('./auth.dto');

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new AppError('Invalid credentials', 401);
  if (user.status !== 'active') throw new AppError('Account is inactive', 401);

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new AppError('Invalid credentials', 401);

  const payload = { id: user._id, roleId: user.roleId };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return toAuthResponse(user, accessToken, refreshToken);
};

const refresh = async ({ refreshToken }) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }
  const user = await User.findById(decoded.id).select('-password');
  if (!user || user.status !== 'active') throw new AppError('User not found or inactive', 401);

  const payload = { id: user._id, roleId: user.roleId };
  const newAccessToken = signAccessToken(payload);
  const newRefreshToken = signRefreshToken(payload);

  return toAuthResponse(user, newAccessToken, newRefreshToken);
};

const me = async (userId) => {
  const user = await User.findById(userId).select('-password').lean();
  if (!user) throw new AppError('User not found', 404);
  return user;
};

module.exports = { login, refresh, me };
