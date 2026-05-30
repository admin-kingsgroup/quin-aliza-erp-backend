const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
  {
    branchCode: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    shortName: { type: String, trim: true },
    icon: { type: String },
    color: { type: String },
    cargoTypes: [{ type: String, enum: ['HD', 'MTL', 'AIR', 'SEA', 'ROAD'] }],
    godownId: { type: mongoose.Schema.Types.ObjectId, ref: 'Godown' },
    branchType: { type: String, enum: ['HO', 'Branch', 'Warehouse'], default: 'Branch' },
    description: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Branch', branchSchema);
