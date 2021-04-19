const express = require('express');
const multer = require('multer');

const router = express.Router();
const authenticate = require('./../controllers/authenticate.controller');

router.post('/register', authenticate.register);
router.post('/login', authenticate.login);

router.get('/questions-count', authenticate.countQuestions);

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

router.post('/upload-photo', upload.array('files', 10), authenticate.firstUpload);


module.exports = router;