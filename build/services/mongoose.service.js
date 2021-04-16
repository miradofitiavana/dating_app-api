"use strict";

var mongoose = require('mongoose');

var config = require('./../configs');

exports.dbConnect = function () {
  mongoose.connect(config.database.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }).then(function () {
    console.log("successfully connected to database");
  })["catch"](function (err) {
    console.log("could not connect to the database", err);
    process.exit();
  });
};
//# sourceMappingURL=mongoose.service.js.map