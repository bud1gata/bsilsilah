const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAll,
  getById,
  create,
  update,
  remove,
  addRelation,
} = require('../controllers/personController');

// All person routes require authentication
router.use(auth);

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);
router.post('/:id/relation', addRelation);

module.exports = router;
