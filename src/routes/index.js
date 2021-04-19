const express = require('express');
const router = express.Router();
const authenticateRouter = require('./authenticate.route');
const usersRouter = require('./users.route');
const categoriesRouter = require('./categories.route');
const questionsRouter = require('./questions.route');

router.use(authenticateRouter);
router.use(usersRouter);
router.use(categoriesRouter);
router.use(questionsRouter);

module.exports = router