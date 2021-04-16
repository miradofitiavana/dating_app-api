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

exports.getSuggestions = (req, res, next) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);
    User.findById(decoded.id).then((data) => {
        let questions = data.answered;
        let rejected = data.rejected.map((a) => a.user);
        let liked = (data.liked.map((a) => a.user)).concat(rejected);
        liked.push(decoded.id);
        User.find({
            answered: { "$in": questions },
            _id: { $nin: liked }
        })
            .then((re) => {
                res.send({
                    data: re
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

exports.firstUpload = (req, res, next) => {
    const reqFiles = []
    for (var i = 0; i < req.files.length; i++) {
        reqFiles.push('public/' + req.files[i].filename)
    }
    let id = req.body.id;
    User.findByIdAndUpdate(
        id,
        { $push: { photo: reqFiles } },
        { new: true, useFindAndModify: false }
    ).then(result => {
        User.findById(id).then(response => {
            res.status(201).send({
                message: "Photo updated",
                photo: true,
                user: {
                    photo: response.photo,
                    firstname: response.firstname,
                    isAdmin: response.isAdmin,
                    nbr_photos: response.photo.length,
                    nbr_answered: response.answered.length,
                },
            })
        }).catch(er => {
            res.status(500).send({
                message: er.message || "Some error occured",
                photo: false,
            })
        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err,
                photo: false,
            });
    })
}

exports.countQuestions = (req, res) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);

    User.findById(decoded.id).then((data) => {
        if (!data) {
            return res.status(404).send({
                message: `user not found with id ${req.params.id}`
            });
        }
        return res.send(
            {
                nombre: data.answered.length
            }
        );
    }).catch((err) => {
        res.status(404).send({
            message: err.message || "Some error occured"
        })
    });
}


exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then((response) => {
            if (!response) {
                return res.status(404).send({
                    auth: false,
                    user: null,
                    token: null,
                    message: `no user find with  email ${req.body.email}`,
                    display: `Cet adresse email n'est rattaché à aucun utilisateur.`
                });
            }
            let compare = bcrypt.compareSync(req.body.password, response.password);
            if (!compare) {
                res.status(401).send({
                    auth: false,
                    user: null,
                    token: null,
                    message: 'Wrong password',
                    display: `Le mot de passe entré n'est pas valide.`
                });
            }
            let userToken = jwt.sign(
                {
                    id: response._id,
                    admin: response.isAdmin
                },
                config.jwt.secret,
                {
                    expiresIn: 86400
                }
            );
            return res.status(200).send({
                auth: true,
                user: {
                    photo: response.photo,
                    firstname: response.firstname,
                    isAdmin: response.isAdmin,
                    nbr_photos: response.photo.length,
                    nbr_answered: response.answered.length,
                },
                token: userToken
            });

        }).catch((err) => {
            return res.status(500).send({
                message: err.message || "Some error occured",
                display: "Une erreur s'est produite."
            })
        });
}

exports.register = (req, res) => {
    let hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
        firstname: req.body.firstname,
        gender: req.body.gender,
        birthday: req.body.birthday,
        location: req.body.location,
        email: req.body.email,
        password: hashedPassword,
        isAdmin: req.body.isAdmin,
    });

    user.save().then(response => {
        let userToken = jwt.sign(
            {
                id: response._id,
                admin: response.isAdmin
            },
            config.jwt.secret,
            {
                expiresIn: 86400
            }
        );
        return res.send({
            auth: true,
            user: {
                photo: response.photo,
                firstname: response.firstname,
                isAdmin: response.isAdmin,
                nbr_photos: response.photo.length,
                nbr_answered: response.answered.length,
            },
            token: userToken
        });
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occured"
        })
    })
}