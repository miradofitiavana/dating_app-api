"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var questionSchema = new Schema({
  question: {
    type: String,
    require: true
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  option1: {
    answer: String,
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  option2: {
    answer: String,
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  like: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislike: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});
module.exports = mongoose.model('Question', questionSchema);
//# sourceMappingURL=question.model.js.map