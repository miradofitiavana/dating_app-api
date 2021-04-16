const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema(
    {
        question: {
            type: String,
            require: true
        },
        categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
        option1: {
            answer: String,
            users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
        },
        option2: {
            answer: String,
            users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
        },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        dislike: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Question', questionSchema);