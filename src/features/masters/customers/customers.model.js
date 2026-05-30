const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String, default: 'Zambia' },
    gstNo: { type: String },
    panNo: { type: String },
    creditLimit: { type: Number, default: 0 },
    creditDays: { type: Number, default: 30 },
    outstandingBalance: { type: Number, default: 0 },
    bankDetails: { type: String },
    contact: { type: String },
    branchIds: [{ type: String }],
    notes: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

customerSchema.index({ name: 'text', code: 'text' });

module.exports = mongoose.model('Customer', customerSchema);
