const express = require('express');

const router = express.Router();
const questions = require('./../controllers/questions.controller');

router.post('/questions', questions.create);
router.get('/questions', questions.list);
// router.delete('/categorie/:id', categories.delete);
router.get('/question/:id', questions.read);
router.put('/question/:id', questions.update);
router.get('/question-random', questions.random);

router.put('/question-update', questions.updateQuestion);
router.get('/question-save', questions.add);

/** Vote questions */
router.get('/question-to-vote', questions.to_vote);
router.post('/question-to-vote', questions.do_vote);

module.exports = router;