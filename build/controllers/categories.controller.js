"use strict";

var Category = require('./../models/category.model');

exports.create = function (req, res) {
  var category = new Category({
    title: req.body.title,
    questions: req.body.questions
  });
  category.save().then(function (data) {
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
  Category.find().then(function (data) {
    res.send({
      data: data
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports["delete"] = function (req, res) {
  var currentID = req.params.id;
  Category.findOne({
    _id: currentID
  }).then(function (dataFound) {
    console.log(dataFound);

    if (dataFound.questions.length > 0) {
      res.status(403).send({
        deleted: false,
        display: "Des questions sont rattachées à cette catégorie. La suppression est impossible."
      });
    } else {
      Category.deleteOne({
        _id: currentID
      }).then(function (dataDeleted) {
        res.status(204).send({
          deleted: true,
          display: "La catégorie a été supprimée avec succès."
        });
      })["catch"](function (errDelete) {
        return console.log(errDelete);
      });
    }
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.read = function (req, res) {
  Category.findById(req.params.id).then(function (data) {
    console.log(data);
    res.send({
      data: data
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.update = function (req, res) {
  Category.findByIdAndUpdate(req.params.id, req.body).then(function (data) {
    console.log(data);
    Category.findById(req.params.id).then(function (response) {
      res.send({
        data: response
      });
    })["catch"](function (err2) {
      return console.log(err2);
    });
  })["catch"](function (err) {
    return console.log(err);
  });
};