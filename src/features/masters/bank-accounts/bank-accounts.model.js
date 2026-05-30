const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    accountName: { type: String, required: true, trim: true },
    bankName: { type: String, required: true, trim: true },
    accountNo: { type: String, required: true, trim: true },
    ifsc: { type: String },
    branch: { type: String },
    currency: { type: String, default: 'USD' },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    glAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'FinanceAccount' },
    openingBalance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BankAccount', schema);
