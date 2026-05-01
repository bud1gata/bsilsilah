const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const auth = require('../middleware/auth');

// Setup storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using crypto to avoid collisions
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|webp|avif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Hanya diperbolehkan mengunggah file gambar (JPEG, JPG, PNG, WEBP, AVIF).'));
  }
}

// @route   POST /api/upload
// @desc    Upload an image
router.post('/', auth, (req, res) => {
  upload.single('photo')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: 'Ukuran file terlalu besar (maksimal 5MB).' });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Silakan pilih file untuk diunggah.' });
    }

    // Return the URL where the frontend can access the file
    res.json({
      success: true,
      message: 'File berhasil diunggah',
      data: {
        photoUrl: `/uploads/${req.file.filename}`
      }
    });
  });
});

module.exports = router;
