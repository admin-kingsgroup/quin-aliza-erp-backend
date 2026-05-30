const mongoose = require('mongoose');

// Audit Log
const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    changes: { type: mongoose.Schema.Types.Mixed },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    ip: { type: String },
  },
  { timestamps: true }
);
auditLogSchema.index({ entity: 1, entityId: 1 });
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ createdAt: -1 });

// Approval Request
const approvalRequestSchema = new mongoose.Schema(
  {
    entity: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    entityType: { type: String, required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    notes: { type: String },
    rejectionReason: { type: String },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    data: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);
approvalRequestSchema.index({ status: 1, requestedAt: -1 });

module.exports = {
  AuditLog: mongoose.model('AuditLog', auditLogSchema),
  ApprovalRequest: mongoose.model('ApprovalRequest', approvalRequestSchema),
};
