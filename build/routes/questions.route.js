"use strict";

var express = require('express');

var router = express.Router();

var questions = require('./../controllers/questions.controller');

router.post('/questions', questions.create);
router.get('/questions', questions.list); // router.delete('/categorie/:id', categories.delete);
// router.get('/categorie/:id', categories.read);
// router.put('/categorie/:id', categories.update);

router.get('/question-random', questions.random);
router.put('/question-update', questions.updateQuestion);
router.get('/question-save', questions.add);
/** Vote questions */

router.get('/question-to-vote', questions.to_vote);
router.post('/question-to-vote', questions.do_vote);
module.exports = router;