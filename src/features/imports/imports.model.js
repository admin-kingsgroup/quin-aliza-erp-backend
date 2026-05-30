const mongoose = require('mongoose');

const impoItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  description: String,
  qty: { type: Number, default: 0 },
  unit: { type: String, default: 'PCS' },
  fobLocal: { type: Number, default: 0 },
  salesPrice: { type: Number, default: 0 },
  containerNo: String,
});

const impoChargesSchema = new mongoose.Schema({
  seaFreight: { type: Number, default: 0 },
  insurance: { type: Number, default: 0 },
  supplierCharges: { type: Number, default: 0 },
  localPortCharges: { type: Number, default: 0 },
  transportDarKasumbalesa: { type: Number, default: 0 },
  customsKasumbalesa: { type: Number, default: 0 },
  transportKasumLubumbashi: { type: Number, default: 0 },
  otherCharges: { type: Number, default: 0 },
});

const impoPaymentSchema = new mongoose.Schema({
  date: { type: Date },
  amount: { type: Number },
  currency: { type: String, default: 'USD' },
  method: { type: String, enum: ['wire', 'cash', 'lc', 'other'], default: 'wire' },
  reference: String,
  notes: String,
});

const impoStepSchema = new mongoose.Schema({
  date: { type: Date },
  notes: { type: String },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const importVoucherSchema = new mongoose.Schema(
  {
    voucherNo: { type: String, required: true },
    impoType: { type: String, enum: ['HD', 'MTL', 'AIR'], required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    supplier: { type: String },
    transporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    transporter: { type: String },
    customAgencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    customAgency: { type: String },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'ImportPlan' },
    planNo: { type: String },
    orderDate: { type: Date, default: Date.now },
    expectedArrival: { type: Date },
    productType: { type: String, enum: ['pt_hd', 'pt_mf', 'pt_mo', 'general'] },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    items: [impoItemSchema],
    charges: { type: impoChargesSchema, default: () => ({}) },
    steps: { type: Map, of: impoStepSchema },
    payments: [impoPaymentSchema],
    totalFOB: { type: Number, default: 0 },
    totalCharges: { type: Number, default: 0 },
    totalCIF: { type: Number, default: 0 },
    currentStage: { type: String, default: 'order_placed' },
    status: { type: String, enum: ['active', 'delivered', 'cancelled'], default: 'active' },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

importVoucherSchema.pre('save', function (next) {
  this.totalFOB = this.items.reduce((s, i) => s + (i.qty || 0) * (i.fobLocal || 0), 0);
  const c = this.charges || {};
  this.totalCharges = Object.values(c.toObject ? c.toObject() : c).reduce((s, v) => s + (Number(v) || 0), 0);
  this.totalCIF = this.totalFOB + this.totalCharges;
  next();
});

importVoucherSchema.index({ voucherNo: 1 });
importVoucherSchema.index({ branchId: 1, status: 1 });

// Import Plan
const importPlanSchema = new mongoose.Schema(
  {
    planNo: { type: String, required: true },
    title: { type: String, required: true },
    season: { type: String },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    expectedDate: { type: Date },
    items: [{ itemId: mongoose.Schema.Types.ObjectId, description: String, qty: Number, unit: String, estimatedCost: Number }],
    totalEstimatedCost: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'approved', 'completed', 'cancelled'], default: 'draft' },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = {
  ImportVoucher: mongoose.model('ImportVoucher', importVoucherSchema),
  ImportPlan: mongoose.model('ImportPlan', importPlanSchema),
};
