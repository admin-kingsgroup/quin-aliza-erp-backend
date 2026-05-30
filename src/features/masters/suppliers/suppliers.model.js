const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['supplier', 'transporter', 'clearing_agent'],
      required: true,
      default: 'supplier',
    },
    country: { type: String, default: 'China' },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String },
    address: { type: String },
    gstNo: { type: String },
    panNo: { type: String },
    tpin: { type: String },
    bankDetails: { type: String },
    contact: { type: String },
    creditLimit: { type: Number, default: 0 },
    creditDays: { type: Number, default: 30 },
    outstandingBalance: { type: Number, default: 0 },
    notes: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

supplierSchema.index({ name: 'text' });
supplierSchema.index({ type: 1 });

module.exports = mongoose.model('Supplier', supplierSchema);
