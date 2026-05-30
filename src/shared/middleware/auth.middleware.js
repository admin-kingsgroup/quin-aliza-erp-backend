const { verifyAccessToken } = require('../utils/jwt');
const User = require('../../features/users/users.model');
const { ROLE_PERMISSIONS } = require('../constants/permissions');
const { UNAUTHORIZED, FORBIDDEN } = require('../constants/statusCodes');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED).json({ success: false, message: 'Access token required' });
  }
  try {
    const token = authHeader.slice(7);
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password').lean();
    if (!user || user.status !== 'active') {
      return res.status(UNAUTHORIZED).json({ success: false, message: 'Invalid or inactive user' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(UNAUTHORIZED).json({ success: false, message: 'Invalid or expired token' });
  }
};

const authorize = (...permissions) => (req, res, next) => {
  const rolePerms = ROLE_PERMISSIONS[req.user.roleId] || [];
  const hasAll = permissions.every((p) => rolePerms.includes(p));
  if (!hasAll) {
    return res.status(FORBIDDEN).json({ success: false, message: 'Insufficient permissions' });
  }
  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (req.user.roleId !== 'role_superadmin') {
    return res.status(FORBIDDEN).json({ success: false, message: 'Super admin access required' });
  }
  next();
};

module.exports = { authenticate, authorize, requireSuperAdmin };
