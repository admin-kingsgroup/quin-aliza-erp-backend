const mongoose = require('mongoose');

const movementLineSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  itemCode: String,
  itemName: String,
  qty: { type: Number, required: true },
  unit: { type: String, default: 'PCS' },
  rate: { type: Number, default: 0 },
  batch: String,
  expiry: Date,
});

const stockMovementSchema = new mongoose.Schema(
  {
    docNo: { type: String, required: true },
    type: { type: String, enum: ['in', 'out', 'transfer', 'adjustment'], required: true },
    date: { type: Date, required: true, default: Date.now },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    godownId: { type: mongoose.Schema.Types.ObjectId, ref: 'Godown' },
    toBranchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    toGodownId: { type: mongoose.Schema.Types.ObjectId, ref: 'Godown' },
    lines: [movementLineSchema],
    reference: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['draft', 'confirmed', 'cancelled'], default: 'confirmed' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

stockMovementSchema.index({ branchId: 1, date: -1 });
stockMovementSchema.index({ type: 1 });
stockMovementSchema.index({ 'lines.itemId': 1 });

module.exports = mongoose.model('StockMovement', stockMovementSchema);
