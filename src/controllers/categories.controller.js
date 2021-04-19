const Category = require('./../models/category.model');

exports.create = (req, res) => {
    const category = new Category({
        title: req.body.title,
        questions: req.body.questions,
    });

    category.save().then(data => {
        res.status(201).send({
            data: data
        });
    }).catch((err) => {
        res.status(500).send({
            message: err || "Some error occured"
        })
    })
}

exports.list = (req, res) => {
    Category.find()
        .then((data) => {
            res.send({
                data: data
            });
        })
        .catch(err => console.log(err))
}

exports.delete = (req, res) => {
    let currentID = req.params.id;
    Category.findOne({ _id: currentID })
        .then((dataFound) => {
            console.log(dataFound);
            if (dataFound.questions.length > 0) {
                res.status(403).send({
                    deleted: false,
                    display: "Des questions sont rattachées à cette catégorie. La suppression est impossible.",
                });
            }
            else {
                Category.deleteOne({ _id: currentID })
                    .then((dataDeleted) => {
                        res.status(204).send({
                            deleted: true,
                            display: "La catégorie a été supprimée avec succès.",
                        });
                    }).catch(errDelete => console.log(errDelete));
            }
        })
        .catch(err => console.log(err))
}

exports.read = (req, res) => {
    Category.findById(req.params.id)
        .then((data) => {
            console.log(data);
            res.status(200).send({
                data: data
            });
        })
        .catch(err => console.log(err))
}

exports.update = (req, res) => {
    Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, useFindAndModify: false }
    )
        .then((response) => {
            return res.status(202).send({
                data: response
            });
        })
        .catch(err => {
            return res.status(500).send({
                message: err || "Some error occured"
            });
        })
}