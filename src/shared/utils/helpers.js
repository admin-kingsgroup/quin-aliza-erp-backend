const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  pages: Math.ceil(total / limit),
  hasNext: page * limit < total,
  hasPrev: page > 1,
});

const parsePagination = (query) => ({
  page: Math.max(1, parseInt(query.page) || 1),
  limit: Math.min(200, Math.max(1, parseInt(query.limit) || 20)),
});

const buildBranchFilter = (user, queryBranchId) => {
  if (user.roleId === 'role_superadmin' || user.roleId === 'role_owner' || user.roleId === 'role_gm') {
    return queryBranchId ? { branchId: queryBranchId } : {};
  }
  const allowed = user.businessIds || [];
  if (queryBranchId && allowed.includes(queryBranchId)) return { branchId: queryBranchId };
  if (allowed.length > 0) return { branchId: { $in: allowed } };
  return { branchId: null };
};

const sanitizeSearch = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = { buildPaginationMeta, parsePagination, buildBranchFilter, sanitizeSearch };
