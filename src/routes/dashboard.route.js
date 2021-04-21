const express = require('express');

const router = express.Router();
const dashboard = require('./../controllers/dashboard.controller');

router.get('/admin-count-users', dashboard.adminCountUsers);
router.get('/admin-count-question', dashboard.adminCountQuestion);

module.exports = router;