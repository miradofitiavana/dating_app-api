"use strict";

var Question = require('./../models/question.model');

var User = require('../models/user.model');

var jwt = require('jsonwebtoken');

exports.do_vote = function (req, res) {
  var token = req.headers.authorization;
  var decoded = jwt.decode(token);
  User.findByIdAndUpdate(decoded.id, {
    $push: {
      votes: {
        question: req.body.question,
        vote: req.body.vote
      }
    }
  }).then(function (user) {
    Question.findByIdAndUpdate(req.body.question, {
      $push: req.body.vote == 'D' ? {
        dislike: decoded.id
      } : {
        like: decoded.id
      }
    }).then(function (quest) {
      User.findById(decoded.id).then(function (fuser) {
        var voted = fuser.votes.map(function (u) {
          return u.question;
        });
        Question.countDocuments().exec(function (err, count) {
          var random = Math.floor(Math.random() * (count - voted.length));
          var skip = random < 0 ? 0 : random;
          console.log(skip);
          Question.findOne({
            "_id": {
              "$nin": voted
            }
          }).populate('author', 'firstname photo').skip(skip).then(function (data) {
            res.send({
              data: data
            });
          })["catch"](function (err) {
            return console.log(err);
          });
        });
      })["catch"](function (err) {
        return console.log(err);
      });
    })["catch"](function (errquest) {
      return console.log(errquest);
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.to_vote = function (req, res) {
  var token = req.headers.authorization;
  var decoded = jwt.decode(token);
  User.findById(decoded.id).then(function (user) {
    var voted = user.votes.map(function (u) {
      return u.question;
    });
    Question.countDocuments().exec(function (err, count) {
      var random = Math.floor(Math.random() * (count - voted.length));
      var skip = random < 0 ? 0 : random;
      console.log(skip);
      Question.findOne({
        "_id": {
          "$nin": voted
        },
        'author': {
          $ne: decoded.id
        }
      }).populate('author', 'firstname photo').skip(skip).then(function (data) {
        res.send({
          data: data
        });
      })["catch"](function (err) {
        return console.log(err);
      });
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.create = function (req, res) {
  var question = new Question({
    question: req.body.question,
    categories: req.body.categories,
    option1: req.body.option1,
    option2: req.body.option2,
    author: req.body.author,
    like: req.body.like,
    dislike: req.body.dislike
  });
  question.save().then(function (data) {
    res.send({
      data: data
    });
  })["catch"](function (err) {
    res.status(500).send({
      message: err || "Some error occured"
    });
  });
};

exports.list = function (req, res) {
  Question.find().populate({
    path: 'categories',
    select: 'title'
  }).then(function (data) {
    res.send({
      data: data
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.random = function (req, res) {
  var token = req.headers.authorization;
  var decoded = jwt.decode(token);
  console.log(decoded);
  User.findById(decoded.id).then(function (user) {
    console.log(user);
    var answered = user.answered.map(function (u) {
      return u.value;
    });
    Question.countDocuments().exec(function (err, count) {
      var random = Math.floor(Math.random() * (count - answered.length));
      Question.findOne({
        "_id": {
          "$nin": answered
        }
      }).skip(random).then(function (data) {
        res.send({
          data: data
        });
      })["catch"](function (err) {
        return console.log(err);
      });
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.updateQuestion = function (req, res) {
  var token = req.headers.authorization;
  var decoded = jwt.decode(token);
  Question.findByIdAndUpdate(req.body.question, {
    $push: req.body.answerChosen == 1 ? {
      'option1.users': decoded.id
    } : {
      'option2.users': decoded.id
    }
  }).then(function (data) {
    User.findByIdAndUpdate(decoded.id, {
      $push: {
        answered: {
          selected: req.body.answerChosen == 1 ? 1 : 2,
          value: req.body.question
        }
      }
    }).then(function (response) {
      res.send({
        data: data
      });
    })["catch"](function (err2) {
      return console.log(err2);
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.add = function (req, res) {
  var temp = [{
    "question": "question1",
    "categories": ["605b6bb1c42a6c24805315d0"],
    "option1": {
      "answer": "1-question1",
      "users": []
    },
    "option2": {
      "answer": "2-question1",
      "users": []
    },
    "author": "606db04e8316215f00a9b1e5"
  }, {
    "question": "question2",
    "categories": ["605b6bb1c42a6c24805315d0"],
    "option1": {
      "answer": "1-question2",
      "users": []
    },
    "option2": {
      "answer": "2-question2",
      "users": []
    },
    "author": "606db04e8316215f00a9b1e5"
  }, {
    "question": "question3",
    "categories": ["605b6bb1c42a6c24805315d0"],
    "option1": {
      "answer": "1-question3",
      "users": []
    },
    "option2": {
      "answer": "2-question3",
      "users": []
    },
    "author": "606db04e8316215f00a9b1e5"
  }, {
    "question": "question4",
    "categories": ["605b6bb1c42a6c24805315d0"],
    "option1": {
      "answer": "1-question4",
      "users": []
    },
    "option2": {
      "answer": "2-question4",
      "users": []
    },
    "author": "606db04e8316215f00a9b1e5"
  }, {
    "question": "question5",
    "categories": ["605b6bb1c42a6c24805315d0"],
    "option1": {
      "answer": "1-question5",
      "users": []
    },
    "option2": {
      "answer": "2-question5",
      "users": []
    },
    "author": "606db04e8316215f00a9b1e5"
  }, {
    "question": "question6",
    "categories": ["605b6bb1c42a6c24805315d0"],
    "option1": {
      "answer": "1-question6",
      "users": []
    },
    "option2": {
      "answer": "2-question6",
      "users": []
    },
    "author": "606db04e8316215f00a9b1e5"
  }, {
    "question": "question7",
    "categories": ["605b6bb1c42a6c24805315d0"],
    "option1": {
      "answer": "1-question7",
      "users": []
    },
    "option2": {
      "answer": "2-question7",
      "users": []
    },
    "author": "606db04e8316215f00a9b1e5"
  }, {
    "question": "question8",
    "categories": ["605b6bb1c42a6c24805315d0"],
    "option1": {
      "answer": "1-question8",
      "users": []
    },
    "option2": {
      "answer": "2-question8",
      "users": []
    },
    "author": "606db04e8316215f00a9b1e5"
  }];
  temp.map(function (a) {
    var question = new Question({
      question: a.question,
      categories: a.categories,
      option1: a.option1,
      option2: a.option2,
      author: a.author,
      validators: a.validators
    });
    question.save().then(function (data) {})["catch"](function (err) {
      res.status(500).send({
        message: err || "Some error occured"
      });
    });
    console.log(a);
  });
  res.send({
    data: "ok"
  });
};
//# sourceMappingURL=questions.controller.js.map