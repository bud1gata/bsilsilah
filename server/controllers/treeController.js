const Tree = require('../models/Tree');
const Person = require('../models/Person');

// @route   GET /api/trees
// @desc    Get all trees belonging to the current user
exports.getTrees = async (req, res) => {
  try {
    // Auto-migration: Check if there are persons without treeId
    const orphanedPersons = await Person.find({ createdBy: req.user._id, treeId: { $exists: false } });
    if (orphanedPersons.length > 0) {
      // Create a default tree for them
      const defaultTree = await Tree.create({
        name: 'Silsilah Lama (Migrasi)',
        description: 'Silsilah yang dibuat sebelum pembaruan sistem.',
        createdBy: req.user._id
      });
      // Update all orphaned persons
      await Person.updateMany(
        { createdBy: req.user._id, treeId: { $exists: false } },
        { treeId: defaultTree._id }
      );
    }

    const trees = await Tree.find({ createdBy: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, data: trees });
  } catch (error) {
    console.error('GetTrees error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil daftar silsilah.' });
  }
};

// @route   POST /api/trees
// @desc    Create a new tree
exports.createTree = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama silsilah wajib diisi.' });
    }
    const tree = await Tree.create({ name, description, createdBy: req.user._id });
    res.status(201).json({ success: true, data: tree, message: 'Silsilah berhasil dibuat.' });
  } catch (error) {
    console.error('CreateTree error:', error);
    res.status(500).json({ success: false, message: 'Gagal membuat silsilah baru.' });
  }
};

// @route   DELETE /api/trees/:id
// @desc    Delete a tree and all its persons
exports.deleteTree = async (req, res) => {
  try {
    const treeId = req.params.id;
    const tree = await Tree.findOne({ _id: treeId, createdBy: req.user._id });
    if (!tree) {
      return res.status(404).json({ success: false, message: 'Silsilah tidak ditemukan.' });
    }
    
    // Delete all persons in this tree
    await Person.deleteMany({ treeId: treeId });
    // Delete the tree itself
    await Tree.deleteOne({ _id: treeId });
    
    res.json({ success: true, message: 'Silsilah beserta seluruh anggotanya berhasil dihapus.' });
  } catch (error) {
    console.error('DeleteTree error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus silsilah.' });
  }
};
