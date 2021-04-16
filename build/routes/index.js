"use strict";

var express = require('express');

var router = express.Router();

var usersRouter = require('./users.route');

var categoriesRouter = require('./categories.route');

var questionsRouter = require('./questions.route');

router.use(usersRouter);
router.use(categoriesRouter);
router.use(questionsRouter);
module.exports = router;