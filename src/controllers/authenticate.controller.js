const User = require('./../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../configs');

exports.countQuestions = (req, res) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);

    User.findById(decoded.id).then((data) => {
        if (!data) {
            return res.status(404).send({
                message: `user not found with id ${req.params.id}`
            });
        }
        return res.send({
            nombre: data.answered.length
        });
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
    ).then(response => {
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
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err,
                photo: false,
            });
    })
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
        ageFrom: 18,
        ageTo: 99,
        showMe: 0
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