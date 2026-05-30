const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: String,
  sku: String,
  price: Number,
  stock: { type: Number, default: 0 },
});

const itemSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    unit: { type: String, default: 'PCS' },
    productType: { type: String, enum: ['pt_hd', 'pt_mf', 'pt_mo', 'general'], default: 'general' },
    category: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemCategory' },
    hsn: { type: String },
    reorderLevel: { type: Number, default: 0 },
    purchasePrice: { type: Number, default: 0 },
    salesPrice: { type: Number, default: 0 },
    weight: { type: Number },
    dimensions: { type: String },
    imageUrl: { type: String },
    variants: [variantSchema],
    taxCodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaxCode' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

itemSchema.index({ name: 'text', code: 'text' });

module.exports = mongoose.model('Item', itemSchema);
