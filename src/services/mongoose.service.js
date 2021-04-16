const mongoose = require('mongoose');

const config = require('./../configs');

exports.dbConnect = () => {
    mongoose.connect(config.database.url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("successfully connected to database")
    }).catch(err => {
        console.log("could not connect to the database", err)
        process.exit();
    });
}