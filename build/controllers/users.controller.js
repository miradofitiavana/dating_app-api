"use strict";

var User = require('./../models/user.model');

var Question = require('./../models/question.model');

var bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

var config = require('./../configs');

exports.getMe = function (req, res, next) {
  var token = req.headers.authorization;
  var decoded = jwt.decode(token);
  User.findById(decoded.id).then(function (re) {
    res.send({
      data: re
    });
  })["catch"](function (e) {
    console.log(e);
  });
};

exports.getQuestionsAVoter = function (req, res, next) {
  var token = req.headers.authorization;
  var decoded = jwt.decode(token);
  User.findById(decoded.id, 'questions').populate('questions').then(function (re) {
    res.send({
      data: re
    });
  })["catch"](function (e) {
    console.log(e);
  });
};

exports.getMyQuestions = function (req, res, next) {
  var token = req.headers.authorization;
  var decoded = jwt.decode(token);
  Question.find({
    author: decoded.id
  }).then(function (re) {
    res.send({
      data: re
    });
  })["catch"](function (e) {
    console.log(e);
  });
};

exports.getLikeMutual = function (req, res, next) {
  var token = req.headers.authorization;
  var decoded = jwt.decode(token);
  User.findById(decoded.id, 'likedme liked').populate('likedme.user', 'photo firstname birthday').populate('liked.user', 'photo firstname birthday').then(function (re) {
    var liked = re.liked.map(function (el) {
      return el.user._id;
    });
    var retour = [];
    re.likedme.forEach(function (element) {
      if (liked.includes(element.user._id)) {
        retour.push(element);
      }
    });
    res.send({
      data: retour
    });
  })["catch"](function (e) {
    console.log(e);
  });
};

exports.getLikedMe = function (req, res, next) {
  var token = req.headers.authorization;
  var decoded = jwt.decode(token);
  User.findById(decoded.id, 'likedme liked rejected').populate('likedme.user', 'photo firstname birthday').populate('liked.user', 'photo firstname birthday').populate('rejected.user', 'photo firstname birthday').then(function (re) {
    var liked = re.liked.map(function (el) {
      return el.user._id;
    });
    var rejected = re.rejected.map(function (a) {
      return a.user_id;
    });
    var all = liked.concat(rejected);
    var retour = [];
    re.likedme.forEach(function (element) {
      if (!all.includes(element.user._id)) {
        retour.push(element);
      }
    });
    res.send({
      data: retour
    });
  })["catch"](function (e) {
    console.log(e);
  });
};

exports.reject = function (req, res) {
  var token = req.headers.authorization;
  var decoded = jwt.decode(token);
  User.findByIdAndUpdate(decoded.id, {
    $push: {
      rejected: {
        user: req.body.id_user
      }
    }
  }).then(function (data) {
    res.status(200).send({
      state: true
    });
  })["catch"](function (err) {
    res.status(404).send({
      message: err.message || "Some error occured"
    });
  });
};

exports.match = function (req, res) {
  var token = req.headers.authorization;
  var decoded = jwt.decode(token);
  User.findByIdAndUpdate(decoded.id, {
    $push: {
      liked: {
        user: req.body.id_user
      }
    }
  }).then(function (data) {
    User.findByIdAndUpdate(req.body.id_user, {
      $push: {
        likedme: {
          user: decoded.id
        }
      }
    }).then(function (data) {
      res.status(200).send({
        state: true
      });
    })["catch"](function (err) {
      res.status(404).send({
        message: err.message || "Some error occured"
      });
    });
  })["catch"](function (err) {
    res.status(404).send({
      message: err.message || "Some error occured"
    });
  });
};

exports.getSuggestions = function (req, res, next) {
  var token = req.headers.authorization;
  var decoded = jwt.decode(token);
  User.findById(decoded.id).then(function (data) {
    var questions = data.answered;
    var rejected = data.rejected.map(function (a) {
      return a.user;
    });
    var liked = data.liked.map(function (a) {
      return a.user;
    }).concat(rejected);
    liked.push(decoded.id);
    User.find({
      answered: {
        "$in": questions
      },
      _id: {
        $nin: liked
      }
    }).then(function (re) {
      res.send({
        data: re
      });
    })["catch"](function (e) {
      console.log(e);
    });
  })["catch"](function (err) {
    res.status(404).send({
      message: err.message || "Some error occured"
    });
  });
};

exports.firstUpload = function (req, res, next) {
  var reqFiles = [];

  for (var i = 0; i < req.files.length; i++) {
    reqFiles.push('public/' + req.files[i].filename);
  }

  var id = req.body.id;
  User.findByIdAndUpdate(id, {
    $push: {
      photo: reqFiles
    }
  }, {
    "new": true,
    useFindAndModify: false
  }).then(function (result) {
    User.findById(id).then(function (response) {
      res.status(201).send({
        message: "Photo updated",
        photo: true,
        user: {
          photo: response.photo,
          firstname: response.firstname,
          isAdmin: response.isAdmin,
          nbr_photos: response.photo.length,
          nbr_answered: response.answered.length
        }
      });
    })["catch"](function (er) {
      res.status(500).send({
        message: er.message || "Some error occured",
        photo: false
      });
    });
  })["catch"](function (err) {
    console.log(err), res.status(500).json({
      error: err,
      photo: false
    });
  });
};

exports.countQuestions = function (req, res) {
  var token = req.headers.authorization;
  var decoded = jwt.decode(token);
  User.findById(decoded.id).then(function (data) {
    if (!data) {
      return res.status(404).send({
        message: "user not found with id ".concat(req.params.id)
      });
    }

    return res.send({
      nombre: data.answered.length
    });
  })["catch"](function (err) {
    res.status(404).send({
      message: err.message || "Some error occured"
    });
  });
};

exports.login = function (req, res) {
  User.findOne({
    email: req.body.email
  }).then(function (response) {
    if (!response) {
      return res.status(404).send({
        auth: false,
        user: null,
        token: null,
        message: "no user find with  email ".concat(req.body.email),
        display: "Cet adresse email n'est rattach\xE9 \xE0 aucun utilisateur."
      });
    }

    var compare = bcrypt.compareSync(req.body.password, response.password);

    if (!compare) {
      res.status(401).send({
        auth: false,
        user: null,
        token: null,
        message: 'Wrong password',
        display: "Le mot de passe entr\xE9 n'est pas valide."
      });
    }

    var userToken = jwt.sign({
      id: response._id,
      admin: response.isAdmin
    }, config.jwt.secret, {
      expiresIn: 86400
    });
    return res.status(200).send({
      auth: true,
      user: {
        photo: response.photo,
        firstname: response.firstname,
        isAdmin: response.isAdmin,
        nbr_photos: response.photo.length,
        nbr_answered: response.answered.length
      },
      token: userToken
    });
  })["catch"](function (err) {
    return res.status(500).send({
      message: err.message || "Some error occured",
      display: "Une erreur s'est produite."
    });
  });
};

exports.register = function (req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 10);
  var user = new User({
    firstname: req.body.firstname,
    gender: req.body.gender,
    birthday: req.body.birthday,
    location: req.body.location,
    email: req.body.email,
    password: hashedPassword,
    isAdmin: req.body.isAdmin
  });
  user.save().then(function (response) {
    var userToken = jwt.sign({
      id: response._id,
      admin: response.isAdmin
    }, config.jwt.secret, {
      expiresIn: 86400
    });
    return res.send({
      auth: true,
      user: {
        photo: response.photo,
        firstname: response.firstname,
        isAdmin: response.isAdmin,
        nbr_photos: response.photo.length,
        nbr_answered: response.answered.length
      },
      token: userToken
    });
  })["catch"](function (err) {
    res.status(500).send({
      message: err.message || "Some error occured"
    });
  });
};
//# sourceMappingURL=users.controller.js.map