const express = require('express');
const router = express.Router();
const usersRouter = require('./users.route');
const categoriesRouter = require('./categories.route');
const questionsRouter = require('./questions.route');

router.use(usersRouter);
router.use(categoriesRouter);
router.use(questionsRouter);

module.exports = router