const toAuthResponse = (user, accessToken, refreshToken) => ({
  accessToken,
  refreshToken,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    roleId: user.roleId,
    businessMode: user.businessMode,
    businessIds: user.businessIds,
    title: user.title,
    phone: user.phone,
  },
});

module.exports = { toAuthResponse };
