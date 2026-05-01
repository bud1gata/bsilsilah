const mongoose = require('mongoose');

const treeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama silsilah wajib diisi'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true, // Ignores undefined
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Tree', treeSchema);
