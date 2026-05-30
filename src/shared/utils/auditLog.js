const AuditLog = require('../../features/approvals/approvals.model').AuditLog;

const log = async ({ userId, action, entity, entityId, changes, branchId, ip }) => {
  try {
    await AuditLog.create({ userId, action, entity, entityId, changes, branchId, ip });
  } catch (_) {
    // non-critical — never throw
  }
};

module.exports = { log };
