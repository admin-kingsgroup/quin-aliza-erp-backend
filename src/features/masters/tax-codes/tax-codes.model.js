const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    rate: { type: Number, required: true, min: 0, max: 100 },
    type: { type: String, enum: ['VAT', 'GST', 'Withholding', 'Customs', 'Other'], default: 'VAT' },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TaxCode', schema);
