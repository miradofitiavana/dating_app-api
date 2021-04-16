const express = require('express');
const multer = require('multer');

const router = express.Router();
const users = require('./../controllers/users.controller');

// const verifyToken = require('./../middlewares/verifyToken');
import verifyToken from "../middlewares/verifyToken";


router.post('/register', users.register);
router.post('/login', users.login);
router.get('/user', users.getMe);
// router.get('/logout', users.logout);
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
const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        console.log(file);
        const ext = file.mimetype.split('/')[1];
        const fileName = Date.now() + "." + ext;
        cb(null, fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
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