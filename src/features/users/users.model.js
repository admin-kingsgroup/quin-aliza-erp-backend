const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    roleId: { type: String, required: true, default: 'role_branch_mgr' },
    title: { type: String, trim: true },
    phone: { type: String, trim: true },
    businessMode: { type: String, enum: ['all', 'specific'], default: 'specific' },
    businessIds: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

userSchema.index({ roleId: 1 });

module.exports = mongoose.model('User', userSchema);
