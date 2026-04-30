const mongoose = require('mongoose');

const personSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Nama depan wajib diisi'],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Jenis kelamin wajib diisi'],
    },
    birthDate: {
      type: Date,
      default: null,
    },
    birthPlace: {
      type: String,
      trim: true,
      default: '',
    },
    deathDate: {
      type: Date,
      default: null,
    },
    deathPlace: {
      type: String,
      trim: true,
      default: '',
    },
    photoUrl: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    positionX: {
      type: Number,
      default: null,
    },
    positionY: {
      type: Number,
      default: null,
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
    // Relations (references to other Person documents)
    parents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
      },
    ],
    spouses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
      },
    ],
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
      },
    ],
    // Belongs to which tree
    treeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tree',
      required: true,
    },
    // Owner of this person record
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries by owner
personSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Person', personSchema);
