const mongoose = require('mongoose');

const VOUCHER_TYPES = [
  'sales', 'cashsale', 'creditsale', 'receipt', 'creditnote',
  'purchase', 'payment', 'debitnote', 'expense', 'contra', 'journal',
];

const voucherLineSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'FinanceAccount' },
  accountCode: String,
  accountName: String,
  debit: { type: Number, default: 0 },
  credit: { type: Number, default: 0 },
  notes: String,
  costCentreId: { type: mongoose.Schema.Types.ObjectId, ref: 'CostCentre' },
});

const voucherSchema = new mongoose.Schema(
  {
    voucherNo: { type: String, required: true },
    vType: { type: String, required: true, enum: VOUCHER_TYPES },
    date: { type: Date, required: true, default: Date.now },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    party: { type: String },
    partyId: { type: mongoose.Schema.Types.ObjectId },
    partyType: { type: String, enum: ['Customer', 'Supplier', ''] },
    productType: { type: String },
    narration: { type: String },
    lines: [voucherLineSchema],
    totalDebit: { type: Number, default: 0 },
    totalCredit: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    exchangeRate: { type: Number, default: 1 },
    status: { type: String, enum: ['draft', 'posted', 'cancelled'], default: 'posted' },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    reference: { type: String },
    attachments: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

voucherSchema.pre('save', function (next) {
  this.totalDebit = this.lines.reduce((s, l) => s + (l.debit || 0), 0);
  this.totalCredit = this.lines.reduce((s, l) => s + (l.credit || 0), 0);
  next();
});

voucherSchema.index({ voucherNo: 1 });
voucherSchema.index({ branchId: 1, date: -1 });
voucherSchema.index({ vType: 1 });
voucherSchema.index({ partyId: 1 });

module.exports = mongoose.model('FinanceVoucher', voucherSchema);
