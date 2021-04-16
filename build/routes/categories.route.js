"use strict";

var express = require('express');

var router = express.Router();

var categories = require('./../controllers/categories.controller');

router.post('/categories', categories.create);
router.get('/categories', categories.list);
router["delete"]('/categorie/:id', categories["delete"]);
router.get('/categorie/:id', categories.read);
router.put('/categorie/:id', categories.update);
module.exports = router;