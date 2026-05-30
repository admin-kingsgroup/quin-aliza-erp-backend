const mongoose = require('mongoose');

const financeAccountSchema = new mongoose.Schema(
  {
    legacyId: { type: String, unique: true, sparse: true, trim: true }, // frontend's acc_* id
    code:     { type: String, unique: true, sparse: true, trim: true }, // optional numeric code
    name:     { type: String, required: true, trim: true },
    group:    { type: String, default: 'General' },
    primaryGroup: { type: String, default: 'Assets' }, // relaxed — no enum enforcement
    type:     { type: String },
    sub:      { type: String },
    appearsIn:{ type: String, default: 'BS' },         // P&L | BS | Balance Sheet | Neither
    side:     { type: String, default: 'Debit' },      // Debit | Credit
    openBal:  { type: Number, default: 0 },
    openType: { type: String, enum: ['Dr', 'Cr'], default: 'Dr' },
    branchId: { type: String },                        // stored as string (br_ho, br_hd, etc.)
    currency: { type: String },
    isSystem: { type: Boolean, default: false },
    hoOnly:   { type: Boolean, default: false },
    active:   { type: Boolean, default: true },
    note:     { type: String },
  },
  { timestamps: true }
);

financeAccountSchema.index({ primaryGroup: 1 });
financeAccountSchema.index({ name: 'text' });

module.exports = mongoose.model('FinanceAccount', financeAccountSchema);
