const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTrees, createTree, deleteTree } = require('../controllers/treeController');
const { getPersonsByTree } = require('../controllers/personController');

router.use(auth);

router.get('/', getTrees);
router.post('/', createTree);
router.delete('/:id', deleteTree);
router.get('/:treeId/persons', getPersonsByTree);

module.exports = router;
