"use strict";

var _verifyToken = _interopRequireDefault(require("../middlewares/verifyToken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var express = require('express');

var multer = require('multer');

var router = express.Router();

var users = require('./../controllers/users.controller'); // const verifyToken = require('./../middlewares/verifyToken');


router.post('/register', users.register);
router.post('/login', users.login);
router.get('/user', users.getMe); // router.get('/logout', users.logout);
// router.get('/user/:id', verifyToken, users.getMe);
// router.put('/user/:id', verifyToken, users.updateMe);

router.get('/user-count', users.countQuestions);
router.get('/user-suggestions', users.getSuggestions);
/** swip */

router.post('/user-match', users.match);
router.post('/user-reject', users.reject);
/** fin swip */

router.get('/user-likedme', users.getLikedMe);
router.get('/user-questions', users.getMyQuestions);
router.get('/user-likemutual', users.getLikeMutual);
/**
 * 
 */

var DIR = './public/';
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, DIR);
  },
  filename: function filename(req, file, cb) {
    console.log(file);
    var ext = file.mimetype.split('/')[1];
    var fileName = Date.now() + "." + ext;
    cb(null, fileName);
  }
});
var upload = multer({
  storage: storage,
  fileFilter: function fileFilter(req, file, cb) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});
router.post('/upload-photo', upload.array('files', 10), users.firstUpload);
module.exports = router;
//# sourceMappingURL=users.route.js.map