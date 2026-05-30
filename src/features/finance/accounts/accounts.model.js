const mongoose = require('mongoose');

const financeAccountSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    group: { type: String, required: true },
    primaryGroup: {
      type: String,
      enum: ['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'],
      required: true,
    },
    type: { type: String },
    sub: { type: String },
    appearsIn: { type: String, enum: ['P&L', 'BS', 'Neither'], default: 'BS' },
    side: { type: String, enum: ['Debit', 'Credit'], required: true },
    openBal: { type: Number, default: 0 },
    openType: { type: String, enum: ['Dr', 'Cr'], default: 'Dr' },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    isSystem: { type: Boolean, default: false },
    hoOnly: { type: Boolean, default: false },
    note: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

financeAccountSchema.index({ primaryGroup: 1 });
financeAccountSchema.index({ name: 'text' });

module.exports = mongoose.model('FinanceAccount', financeAccountSchema);
