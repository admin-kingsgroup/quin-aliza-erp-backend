const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CostCentre', schema);
