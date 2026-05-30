const mongoose = require('mongoose');

const godownSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, required: true, trim: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    address: { type: String },
    capacity: { type: Number },
    notes: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Godown', godownSchema);
