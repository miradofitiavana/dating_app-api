const express = require('express');

const router = express.Router();
const categories = require('./../controllers/categories.controller');

router.post('/categories', categories.create);
router.get('/categories', categories.list);
router.delete('/categorie/:id', categories.delete);
router.get('/categorie/:id', categories.read);
router.put('/categorie/:id', categories.update);

module.exports = router;