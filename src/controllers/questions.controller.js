const Question = require('./../models/question.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.do_vote = (req, res) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);
    User.findByIdAndUpdate(
        decoded.id,
        { $push: { votes: { question: req.body.question, vote: req.body.vote } } },
        { new: true, useFindAndModify: false }
    )
        .then((userUpdated) => {
            let userVote = { dislike: decoded.id };
            if (req.body.vote == 'L') { userVote = { like: decoded.id } };
            Question.findByIdAndUpdate(req.body.question,
                { $push: userVote },
                { new: true, useFindAndModify: false }
            ).
                then((questionUpdated) => {
                    User.findById(decoded.id)
                        .then((user) => {
                            let voted = user.votes.map((u) => u.question);
                            Question.countDocuments()
                                .then(nbrQuestion => {
                                    var random = Math.floor(Math.random() * (nbrQuestion - (voted.length + 1)));
                                    if (random < 0) {
                                        return res.send({
                                            nbrQuestion: nbrQuestion,
                                            nbrVoted: voted.length,
                                            skip: random,
                                            data: null
                                        });
                                    }
                                    Question.findOne({
                                        "like": { $nin: decoded.id },
                                        "dislike": { $nin: decoded.id },
                                        'author': { $ne: decoded.id }
                                    })
                                        .populate('author', 'firstname photo')
                                        .populate('categories', 'title')
                                        .skip(random)
                                        .then((data) => {
                                            return res.send({
                                                nbrQuestion: nbrQuestion,
                                                nbrVoted: voted.length,
                                                skip: random,
                                                data: data
                                            });
                                        })
                                        .catch(dataError => {
                                            return res.send({
                                                nbrQuestion: nbrQuestion,
                                                nbrVoted: voted.length,
                                                skip: random,
                                                data: dataError
                                            })
                                        });
                                })
                                .catch(nbrError => {
                                    console.log(nbrError);
                                });
                        })
                        .catch(err => console.log(err));
                }).catch(questionError => console.log(questionError));
        })
        .catch(userError => console.log(userError));
}

exports.to_vote = (req, res) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);
    User.findById(decoded.id)
        .then((user) => {
            let voted = user.votes.map((u) => u.question);
            Question.countDocuments()
                .then(nbrQuestion => {
                    var random = Math.floor(Math.random() * (nbrQuestion - (voted.length + 1)));
                    if (random < 0) {
                        return res.send({
                            nbrQuestion: nbrQuestion,
                            nbrVoted: voted.length,
                            skip: random,
                            data: null
                        });
                    }
                    Question.findOne({
                        "like": { $nin: decoded.id },
                        "dislike": { $nin: decoded.id },
                        'author': { $ne: decoded.id }
                    })
                        .populate('author', 'firstname photo')
                        .populate('categories', 'title')
                        .skip(random)
                        .then((data) => {
                            return res.send({
                                nbrQuestion: nbrQuestion,
                                nbrVoted: voted.length,
                                skip: random,
                                data: data
                            });
                        })
                        .catch(dataError => {
                            return res.send({
                                nbrQuestion: nbrQuestion,
                                nbrVoted: voted.length,
                                skip: random,
                                data: dataError
                            })
                        });
                })
                .catch(nbrError => {
                    console.log(nbrError);
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

exports.read = (req, res) => {
    Question.findById(req.params.id)
        .populate({ path: 'categories', select: 'title' })
        .populate({ path: 'author', select: 'firstname' })
        .then((data) => {
            res.status(200).send({
                data: data
            });
        })
        .catch(err => console.log(err))
}

exports.update = (req, res) => {
    let body = {
        question: req.body.question,
        categories: req.body.categories.map((item) => item._id),
        option1: {
            answer: req.body.option1.answer
        },
        option2: {
            answer: req.body.option2.answer
        },
    }
    Question.findByIdAndUpdate(
        req.params.id,
        body,
        { new: true, useFindAndModify: false }
    )
        .populate({ path: 'categories', select: 'title' })
        .populate({ path: 'author', select: 'firstname' })
        .then((response) => {
            return res.status(202).send({
                data: response
            });
        })
        .catch(err => {
            return res.status(500).send({
                message: err || "Some error occured"
            });
        })
}

exports.list = (req, res) => {
    Question.find()
        .populate({ path: 'categories', select: 'title' })
        .populate({ path: 'author', select: 'firstname' })
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
            let answered = user.answered.map((u) => u.value);
            Question.countDocuments().exec(function (err, count) {
                var random = Math.floor(Math.random() * (count - answered.length));
                Question.findOne({ "_id": { "$nin": answered } })
                    .skip(random)
                    .populate("categories")
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
            "question": "Es-tu prêt à faire de la route pour rencontrer quelqu'un ?",
            "categories": ["607c295847a1320174515ee6"],
            "option1": {
                "answer": "Oui, parce que je veux mieux la connaître",
                "users": []
            },
            "option2": {
                "answer": "Non.",
                "users": []
            },
            "author": "607c5b05bdbaec626c3e2f06"
        },
        {
            "question": "Tu écoutes plutôt?",
            "categories": ["607c295847a1320174515ee6"],
            "option1": {
                "answer": "Ton coeur",
                "users": []
            },
            "option2": {
                "answer": "Ta tête",
                "users": []
            },
            "author": "607c5b05bdbaec626c3e2f06"
        },
        {
            "question": "Pour toi le sport c'est ?",
            "categories": ["607c295847a1320174515ee6"],
            "option1": {
                "answer": "Un mal nécessaire",
                "users": []
            },
            "option2": {
                "answer": "Un plaisir",
                "users": []
            },
            "author": "607c5b05bdbaec626c3e2f06"
        },
        {
            "question": "Aimes-tu le sport ?",
            "categories": ["607c295847a1320174515ee6"],
            "option1": {
                "answer": "Oui",
                "users": []
            },
            "option2": {
                "answer": "Non",
                "users": []
            },
            "author": "607c5b05bdbaec626c3e2f06"
        },
        {
            "question": "Aimes-tu l'adrénaline ?",
            "categories": ["607c295847a1320174515ee6"],
            "option1": {
                "answer": "Oui, j'aime vivre les choses à fond.",
                "users": []
            },
            "option2": {
                "answer": "Non, j'évite quand c'est dangereux.",
                "users": []
            },
            "author": "607c5b05bdbaec626c3e2f06"
        },
        {
            "question": "Le meilleur combo devant un match ?",
            "categories": ["607c295847a1320174515ee6"],
            "option1": {
                "answer": "Pizza/bière",
                "users": []
            },
            "option2": {
                "answer": "Kebab/Ice Tea",
                "users": []
            },
            "author": "607c5b05bdbaec626c3e2f06"
        },
        {
            "question": "On t'invite à regarder un match pour un premier rendez-vous...",
            "categories": ["607c295847a1320174515ee6"],
            "option1": {
                "answer": "Bonne idée, ça peut être sympa",
                "users": []
            },
            "option2": {
                "answer": "Non merci, on se verra quand ce sera terminé",
                "users": []
            },
            "author": "607c5b05bdbaec626c3e2f06"
        },
        {
            "question": "Combien de temps voudrais-tu que dure ta prochaine relation?",
            "categories": ["607c295847a1320174515ee6"],
            "option1": {
                "answer": "6 mois à 1 an",
                "users": []
            },
            "option2": {
                "answer": "Le plus longtemps possible",
                "users": []
            },
            "author": "607c5b05bdbaec626c3e2f06"
        },
        {
            "question": "En prévision d'une soirée Netflix & Sucreries, quelle glace achètes-tu ?",
            "categories": ["607c295847a1320174515ee6"],
            "option1": {
                "answer": "Ben & Jerry's",
                "users": []
            },
            "option2": {
                "answer": "Häagen-Dazs",
                "users": []
            },
            "author": "607c5b05bdbaec626c3e2f06"
        },
        {
            "question": "Le meilleur goût du Kinder",
            "categories": ["607c295847a1320174515ee6"],
            "option1": {
                "answer": "Classic",
                "users": []
            },
            "option2": {
                "answer": "White",
                "users": []
            },
            "author": "607c5b05bdbaec626c3e2f06"
        },
        {
            "question": "Au petit déjeuner, que préfères-tu ?",
            "categories": ["607c295847a1320174515ee6"],
            "option1": {
                "answer": "Chocapic",
                "users": []
            },
            "option2": {
                "answer": "Miel Pops",
                "users": []
            },
            "author": "607c5b05bdbaec626c3e2f06"
        },
        {
            "question": "Quelle est la marque de sport qui t'inspire le plus ?",
            "categories": ["607c295847a1320174515ee6"],
            "option1": {
                "answer": "Rip Curl",
                "users": []
            },
            "option2": {
                "answer": "Nike",
                "users": []
            },
            "author": "607c5b05bdbaec626c3e2f06"
        },
        {
            "question": "Coca ou Ice Tea ?",
            "categories": ["607c295847a1320174515ee6"],
            "option1": {
                "answer": "Coca",
                "users": []
            },
            "option2": {
                "answer": "Ice Tea",
                "users": []
            },
            "author": "607c5b05bdbaec626c3e2f06"
        },
        {
            "question": "Quelle console choisis-tu ?",
            "categories": ["607c295847a1320174515ee6"],
            "option1": {
                "answer": "Playstation",
                "users": []
            },
            "option2": {
                "answer": "Xbox",
                "users": []
            },
            "author": "607c5b05bdbaec626c3e2f06"
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