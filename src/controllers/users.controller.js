const User = require('./../models/user.model');
const Question = require('./../models/question.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../configs');

exports.getMe = (req, res, next) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);
    User.findById(decoded.id)
        .then((re) => {
            res.send({
                data: re
            });
        })
        .catch(e => {
            console.log(e);
        })
}

exports.updatePrefs = (req, res) => {
    const id = req.params.id;
    const user = {
        showMe: req.body.showMe,
        ageFrom: req.body.ageFrom,
        ageTo: req.body.ageTo
    };

    User.findByIdAndUpdate(id, user,
        { new: true, useFindAndModify: false }
    )
        .then(response => {
            res.status(200).send({
                message: "user updated",
                data: response
            })
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occured"
            })
        });
}

exports.updateMe = (req, res) => {
    const id = req.params.id;
    const user = {
        firstname: req.body.firstname,
        // gender: req.body.gender,
        birthday: req.body.birthday,
        location: req.body.location,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
    };

    User.findByIdAndUpdate(id, user,
        { new: true, useFindAndModify: false }
    )
        .then(response => {
            res.status(200).send({
                message: "user updated",
                data: response
            })
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occured"
            })
        });
}


exports.getQuestionsAVoter = (req, res, next) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);
    User.findById(decoded.id, 'questions')
        .populate('questions')
        .then((re) => {
            res.send({
                data: re
            });
        })
        .catch(e => {
            console.log(e);
        })
}

exports.getMyQuestions = (req, res, next) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);
    Question.find({ author: decoded.id })
        .then((re) => {
            res.send({
                data: re
            });
        })
        .catch(e => {
            console.log(e);
        })
}

exports.getLikeMutual = (req, res, next) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);
    User.findById(decoded.id, 'likedme liked')
        .populate('likedme.user', 'photo firstname birthday')
        .populate('liked.user', 'photo firstname birthday')
        .then((re) => {
            let liked = re.liked.map(el => el.user._id);
            let retour = [];

            re.likedme.forEach((element) => {
                if (liked.includes(element.user._id)) {
                    retour.push(element);
                }
            })

            res.send({
                data: retour
            })
        })
        .catch(e => {
            console.log(e);
        })
}

exports.getLikedMe = (req, res, next) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);
    User.findById(decoded.id, 'likedme liked rejected')
        .populate('likedme.user', 'photo firstname birthday')
        .populate('liked.user', 'photo firstname birthday')
        .populate('rejected.user', 'photo firstname birthday')
        .then((re) => {
            let liked = re.liked.map(el => el.user._id);
            let rejected = re.rejected.map((a) => a.user_id);

            let all = liked.concat(rejected);

            let retour = [];

            re.likedme.forEach((element) => {
                if (!all.includes(element.user._id)) {
                    retour.push(element);
                }
            })

            res.send({
                data: retour
            })
        })
        .catch(e => {
            console.log(e);
        })
}

exports.reject = (req, res) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);

    User.findByIdAndUpdate(decoded.id, { $push: { rejected: { user: req.body.id_user, }, } })
        .then((data) => {
            res.status(200).send({
                state: true
            });
        }).catch((err) => {
            res.status(404).send({
                message: err.message || "Some error occured"
            })
        });
}

exports.match = (req, res) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);

    User.findByIdAndUpdate(decoded.id, { $push: { liked: { user: req.body.id_user, }, } })
        .then((data) => {
            User.findByIdAndUpdate(req.body.id_user, { $push: { likedme: { user: decoded.id, }, } }
            ).then((data) => {
                res.status(200).send({
                    state: true
                });
            }).catch((err) => {
                res.status(404).send({
                    message: err.message || "Some error occured"
                })
            });
        }).catch((err) => {
            res.status(404).send({
                message: err.message || "Some error occured"
            })
        });
}

// var grouped = (list, key) => list.reduce((hash, obj) => ({ ...hash, [obj[key]]: (hash[obj[key]] || []).concat(obj) }), {});

exports.getSuggestions = (req, res, next) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);
    User.findById(decoded.id).then((data) => {
        let questions = data.answered;
        let rejected = data.rejected.map((a) => a.user);
        let liked = (data.liked.map((a) => a.user)).concat(rejected);
        liked.push(decoded.id);

        let gender = data.showMe == 0 ? { $in: [-1, 1] } : data.showMe;
        let birthFrom = new Date();
        birthFrom.setFullYear(birthFrom.getFullYear() - data.ageFrom);
        let birthTo = new Date();
        birthTo.setFullYear(birthTo.getFullYear() - data.ageTo);

        console.log(data.birthday);
        console.log(birthFrom);
        console.log(birthTo);

        User.find({
            answered: { "$in": questions },
            _id: { $nin: liked },
            gender: gender,
            birthday: { $lte: birthFrom, $gte: birthTo }
        }, 'answered photo firstname birthday _id')
            .then((reponse) => {
                var percentage = (questions, nombre) => (nombre * 100) / questions.length;

                var count_similarities = (arrayA, arrayB) => {
                    var matches = 0;
                    arrayA.forEach(itemA => {
                        arrayB.forEach((itemB) => {
                            if (JSON.stringify(itemB) == JSON.stringify(itemA)) {
                                matches++;
                            }
                        });
                    });
                    return matches;
                };

                let valeurs = [];
                reponse.forEach((item) => {
                    let filteredArray = count_similarities(item.answered, questions);
                    let temporaire = {
                        _id: item._id,
                        photo: item.photo,
                        firstname: item.firstname,
                        birthday: item.birthday,
                        compatibility: percentage(questions, filteredArray).toFixed(2),
                    };
                    valeurs.push(temporaire);
                });

                return res.send({
                    data: valeurs
                });
            })
            .catch(e => {
                console.log(e);
            })
    }).catch((err) => {
        res.status(404).send({
            message: err.message || "Some error occured"
        })
    });
}

