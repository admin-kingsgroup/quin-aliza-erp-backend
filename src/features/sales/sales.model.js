const mongoose = require('mongoose');

const saleLineSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  itemCode: String,
  itemName: String,
  qty: { type: Number, required: true },
  unit: { type: String, default: 'PCS' },
  rate: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  amount: { type: Number },
});

const salesSchema = new mongoose.Schema(
  {
    orderNo: { type: String, required: true },
    type: { type: String, enum: ['sales', 'pos', 'return'], default: 'sales' },
    date: { type: Date, required: true, default: Date.now },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String },
    lines: [saleLineSchema],
    subtotal: { type: Number, default: 0 },
    discountTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    paymentMode: { type: String, enum: ['cash', 'card', 'credit', 'transfer'], default: 'cash' },
    status: { type: String, enum: ['draft', 'confirmed', 'delivered', 'cancelled', 'returned'], default: 'confirmed' },
    deliveryDate: { type: Date },
    notes: { type: String },
    reference: { type: String },
    voucherRef: { type: mongoose.Schema.Types.ObjectId, ref: 'FinanceVoucher' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

salesSchema.pre('save', function (next) {
  this.lines.forEach((l) => {
    l.amount = l.qty * l.rate - (l.discount || 0);
  });
  this.subtotal = this.lines.reduce((s, l) => s + l.qty * l.rate, 0);
  this.discountTotal = this.lines.reduce((s, l) => s + (l.discount || 0), 0);
  this.taxTotal = this.lines.reduce((s, l) => s + (l.tax || 0), 0);
  this.totalAmount = this.subtotal - this.discountTotal + this.taxTotal;
  next();
});

salesSchema.index({ orderNo: 1 });
salesSchema.index({ branchId: 1, date: -1 });
salesSchema.index({ customerId: 1 });

module.exports = mongoose.model('SalesOrder', salesSchema);
