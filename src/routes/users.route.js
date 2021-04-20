const express = require('express');
const multer = require('multer');

const router = express.Router();
const users = require('./../controllers/users.controller');

// const verifyToken = require('./../middlewares/verifyToken');
import verifyToken from "../middlewares/verifyToken";

// router.get('/user', users.getMe);
// router.get('/logout', users.logout);
router.get('/user/:id', users.getMe);
router.put('/user/:id', users.updateMe);
router.put('/user-preferences/:id', users.updatePrefs);
router.get('/user-suggestions', users.getSuggestions);
/** swip */
router.post('/user-match', users.match);
router.post('/user-reject', users.reject);
/** fin swip */
router.get('/user-likedme', users.getLikedMe);
router.get('/user-questions', users.getMyQuestions);
router.get('/user-likemutual', users.getLikeMutual);


module.exports = router;