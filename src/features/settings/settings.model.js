const mongoose = require('mongoose');

// FX Rates
const fxRateSchema = new mongoose.Schema(
  {
    currency: { type: String, required: true },
    rate: { type: Number, required: true },
    baseRate: { type: Number },
    effectiveDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
fxRateSchema.index({ currency: 1, effectiveDate: -1 });

// Document Series
const docSeriesSchema = new mongoose.Schema(
  {
    module: { type: String, required: true, unique: true },
    prefix: { type: String, default: '' },
    currentNo: { type: Number, default: 0 },
    suffix: { type: String, default: '' },
    lastUsed: { type: Date },
  },
  { timestamps: true }
);

// Financial Year
const financialYearSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);

// App Notifications
const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String },
    title: { type: String, required: true },
    message: { type: String },
    entity: { type: String },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    isRead: { type: Boolean, default: false },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  },
  { timestamps: true }
);

module.exports = {
  FxRate: mongoose.model('FxRate', fxRateSchema),
  DocSeries: mongoose.model('DocSeries', docSeriesSchema),
  FinancialYear: mongoose.model('FinancialYear', financialYearSchema),
  Notification: mongoose.model('Notification', notificationSchema),
};
