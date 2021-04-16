"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var categorySchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }]
});
module.exports = mongoose.model('Category', categorySchema);
//# sourceMappingURL=category.model.js.map