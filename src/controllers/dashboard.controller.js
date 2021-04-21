const User = require('./../models/user.model');
const Question = require('./../models/question.model');
// const User = require('./../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../configs');

exports.adminCountUsers = (req, res) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);
    User.countDocuments()
        .then((data) => {
            return res.status(200).send({
                countUser: data
            });
        }).catch((err) => {
            res.status(404).send({
                message: err.message || "Some error occured"
            })
        });
}

exports.adminCountQuestion = (req, res) => {
    let token = req.headers.authorization;
    var decoded = jwt.decode(token);
    Question.countDocuments()
        .then((data) => {
            return res.status(200).send({
                countQuestion: data
            });
        }).catch((err) => {
            res.status(404).send({
                message: err.message || "Some error occured"
            })
        });
}
