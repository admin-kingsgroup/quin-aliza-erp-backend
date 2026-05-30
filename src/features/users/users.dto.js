const toUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  roleId: user.roleId,
  title: user.title,
  phone: user.phone,
  businessMode: user.businessMode,
  businessIds: user.businessIds,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

module.exports = { toUserResponse };
