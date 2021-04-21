const express = require('express');
const router = express.Router();
const authenticateRouter = require('./authenticate.route');
const usersRouter = require('./users.route');
const categoriesRouter = require('./categories.route');
const questionsRouter = require('./questions.route');
const dashboardRouter = require('./dashboard.route');

router.use(authenticateRouter);
router.use(usersRouter);
router.use(categoriesRouter);
router.use(questionsRouter);
router.use(dashboardRouter);

module.exports = router