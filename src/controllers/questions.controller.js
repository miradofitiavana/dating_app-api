const Question = require('./../models/question.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.do_vote = (req, res) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);
    User.findByIdAndUpdate(decoded.id, {
        $push: {
            votes: {
                question: req.body.question,
                vote: req.body.vote
            }
        }
    })
        .then((user) => {
            Question.findByIdAndUpdate(req.body.question, {
                $push: req.body.vote == 'D' ? { dislike: decoded.id } : { like: decoded.id }
            }).
                then((quest) => {
                    User.findById(decoded.id)
                        .then((fuser) => {
                            let voted = fuser.votes.map((u) => u.question);
                            Question.countDocuments().exec(function (err, count) {
                                var random = Math.floor(Math.random() * (count - voted.length));
                                let skip = random < 0 ? 0 : random;
                                console.log(skip);
                                Question.findOne({ "_id": { "$nin": voted } })
                                    .populate('author', 'firstname photo')
                                    .skip(skip)
                                    .then((data) => {
                                        res.send({
                                            data: data
                                        })
                                    })
                                    .catch(err => console.log(err))
                            });
                        })
                        .catch(err => console.log(err));
                }).catch(errquest => console.log(errquest));
        })
        .catch(err => console.log(err));
}

exports.to_vote = (req, res) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);
    User.findById(decoded.id)
        .then((user) => {
            let voted = user.votes.map((u) => u.question);
            Question.countDocuments().exec(function (err, count) {
                var random = Math.floor(Math.random() * (count - voted.length));
                let skip = random < 0 ? 0 : random;
                console.log(skip);
                Question.findOne({ "_id": { "$nin": voted }, 'author': { $ne: decoded.id } })
                    .populate('author', 'firstname photo')
                    .skip(skip)
                    .then((data) => {
                        res.send({
                            data: data
                        })
                    })
                    .catch(err => console.log(err))
            });
        })
        .catch(err => console.log(err));
}

exports.create = (req, res) => {
    const question = new Question({
        question: req.body.question,
        categories: req.body.categories,
        option1: req.body.option1,
        option2: req.body.option2,
        author: req.body.author,
        like: req.body.like,
        dislike: req.body.dislike,
    });

    question.save().then(data => {
        res.send({
            data: data
        });
    }).catch((err) => {
        res.status(500).send({
            message: err || "Some error occured"
        })
    })
}

exports.list = (req, res) => {
    Question.find()
        .populate({ path: 'categories', select: 'title' })
        .then((data) => {
            res.send({
                data: data
            });
        })
        .catch(err => console.log(err))
}

exports.random = (req, res) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);
    console.log(decoded);
    User.findById(decoded.id)
        .then((user) => {
            console.log(user);
            let answered = user.answered.map((u) => u.value);
            Question.countDocuments().exec(function (err, count) {
                var random = Math.floor(Math.random() * (count - answered.length));
                Question.findOne({ "_id": { "$nin": answered } })
                    .skip(random)
                    .then((data) => {
                        res.send({
                            data: data
                        })
                    })
                    .catch(err => console.log(err))
            });
        })
        .catch(err => console.log(err));
}

exports.updateQuestion = (req, res) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);

    Question.findByIdAndUpdate(req.body.question, {
        $push: req.body.answerChosen == 1 ? { 'option1.users': decoded.id } : { 'option2.users': decoded.id }
    })
        .then((data) => {
            User.findByIdAndUpdate(decoded.id, {
                $push: {
                    answered: {
                        selected: req.body.answerChosen == 1 ? 1 : 2,
                        value: req.body.question,
                    },
                }
            })
                .then(response => {
                    res.send({
                        data: data
                    });
                })
                .catch(err2 => console.log(err2))
        })
        .catch(err => console.log(err))
}

exports.add = (req, res) => {
    let temp = [
        {
            "question": "question1",
            "categories": [
                "605b6bb1c42a6c24805315d0"
            ],
            "option1": {
                "answer": "1-question1",
                "users": []
            },
            "option2": {
                "answer": "2-question1",
                "users": []
            },
            "author": "606db04e8316215f00a9b1e5"
        },
        {
            "question": "question2",
            "categories": [
                "605b6bb1c42a6c24805315d0"
            ],
            "option1": {
                "answer": "1-question2",
                "users": []
            },
            "option2": {
                "answer": "2-question2",
                "users": []
            },
            "author": "606db04e8316215f00a9b1e5"
        },
        {
            "question": "question3",
            "categories": [
                "605b6bb1c42a6c24805315d0"
            ],
            "option1": {
                "answer": "1-question3",
                "users": []
            },
            "option2": {
                "answer": "2-question3",
                "users": []
            },
            "author": "606db04e8316215f00a9b1e5"
        },
        {
            "question": "question4",
            "categories": [
                "605b6bb1c42a6c24805315d0"
            ],
            "option1": {
                "answer": "1-question4",
                "users": []
            },
            "option2": {
                "answer": "2-question4",
                "users": []
            },
            "author": "606db04e8316215f00a9b1e5"
        },
        {
            "question": "question5",
            "categories": [
                "605b6bb1c42a6c24805315d0"
            ],
            "option1": {
                "answer": "1-question5",
                "users": []
            },
            "option2": {
                "answer": "2-question5",
                "users": []
            },
            "author": "606db04e8316215f00a9b1e5"
        },
        {
            "question": "question6",
            "categories": [
                "605b6bb1c42a6c24805315d0"
            ],
            "option1": {
                "answer": "1-question6",
                "users": []
            },
            "option2": {
                "answer": "2-question6",
                "users": []
            },
            "author": "606db04e8316215f00a9b1e5"
        },
        {
            "question": "question7",
            "categories": [
                "605b6bb1c42a6c24805315d0"
            ],
            "option1": {
                "answer": "1-question7",
                "users": []
            },
            "option2": {
                "answer": "2-question7",
                "users": []
            },
            "author": "606db04e8316215f00a9b1e5"
        },
        {
            "question": "question8",
            "categories": [
                "605b6bb1c42a6c24805315d0"
            ],
            "option1": {
                "answer": "1-question8",
                "users": []
            },
            "option2": {
                "answer": "2-question8",
                "users": []
            },
            "author": "606db04e8316215f00a9b1e5"
        }
    ];
    temp.map(a => {
        const question = new Question({
            question: a.question,
            categories: a.categories,
            option1: a.option1,
            option2: a.option2,
            author: a.author,
            validators: a.validators,
        });

        question.save().then(data => {

        }).catch((err) => {
            res.status(500).send({
                message: err || "Some error occured"
            })
        })
        console.log(a);
    })
    res.send({
        data: "ok"
    });
}