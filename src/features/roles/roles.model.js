const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    roleId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    permissions: [{ type: String }],
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
