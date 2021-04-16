const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    }
);

module.exports = mongoose.model('Category', categorySchema);