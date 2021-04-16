"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var userSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  gender: {
    type: Number
  },
  birthday: {
    type: Date
  },
  location: {
    type: String
  },
  email: {
    type: String,
    required: true // unique: true

  },
  password: {
    type: String,
    required: true
  },
  isAdmin: Boolean,
  //
  photo: Array,
  answered: [{
    _id: false,
    selected: String,
    value: {
      type: Schema.Types.ObjectId,
      ref: 'Question'
    }
  }],
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  votes: [{
    type: new mongoose.Schema({
      _id: false,
      question: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
      },
      vote: ['L', 'D']
    }, {
      timestamps: true
    })
  }],
  //
  liked: [{
    type: new mongoose.Schema({
      _id: false,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }, {
      timestamps: true
    })
  }],
  rejected: [{
    type: new mongoose.Schema({
      _id: false,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }, {
      timestamps: true
    })
  }],
  likedme: [{
    type: new mongoose.Schema({
      _id: false,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }, {
      timestamps: true
    })
  }]
}, {
  timestamps: true
});
module.exports = mongoose.model('User', userSchema);
//# sourceMappingURL=user.model.js.map