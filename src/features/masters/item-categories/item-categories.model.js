const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, required: true, trim: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemCategory' },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ItemCategory', schema);
