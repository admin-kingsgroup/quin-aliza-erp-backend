const mongoose = require('mongoose');

const priceLineSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  itemCode: String,
  itemName: String,
  price: { type: Number, required: true },
  minQty: { type: Number, default: 1 },
});

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    currency: { type: String, default: 'USD' },
    validFrom: { type: Date },
    validTo: { type: Date },
    branchIds: [{ type: String }],
    lines: [priceLineSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PriceList', schema);
