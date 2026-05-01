const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTrees, createTree, deleteTree, toggleShare, getSharedTree, getSharedTreePersons } = require('../controllers/treeController');
const { getPersonsByTree } = require('../controllers/personController');

// Public routes (no auth required)
router.get('/share/:shareToken', getSharedTree);
router.get('/share/:shareToken/persons', getSharedTreePersons);

// Authenticated routes
router.use(auth);

router.get('/', getTrees);
router.post('/', createTree);
router.delete('/:id', deleteTree);
router.put('/:id/share', toggleShare);
router.get('/:treeId/persons', getPersonsByTree);

module.exports = router;
