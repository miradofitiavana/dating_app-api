require('dotenv').config();

const app = require('./services/server.service');
const mongoose = require('./services/mongoose.service');

mongoose.dbConnect();
app.start();



// app.get('/users', function (req, res) {
//     User.find().then((data) => {
//         res.send(data);
//     }).catch((err) => {
//         res.status(500).send({
//             message: err.message || "Some error occured"
//         })
//     });
// });

// app.get('/users/:id', function (req, res) {
//     let id = req.params.id;
//     User.findById(id).then((data) => {
//         res.send(data);
//     }).catch((err) => {
//         res.status(500).send({
//             message: err.message || "Some error occured"
//         })
//     });
// });

// app.put('/users/:id', function (req, res) {
//     let id = req.params.id;
//     User.findByIdAndUpdate(id, req.body).then((data) => {
//         res.send(data);
//     }).catch((err) => {
//         res.status(500).send({
//             message: err.message || "Some error occured"
//         })
//     });
// });

// app.delete('/users/:id', function (req, res) {
//     let id = req.params.id;
//     User.findByIdAndRemove(id).then((data) => {
//         res.send({ "message": "User deleted." });
//     }).catch((err) => {
//         res.status(500).send({
//             message: err.message || "Some error occured"
//         })
//     });
// });

// app.post('/products', function (req, res) {
//     console.log(req.body.test);
//     res.send(req.body);
// });

// app.get(
//     // Routes
//     '/products',
//     // Controller
//     function (req, res) {
//         res.send([
//             { "name": "product1", "price": "30" },
//             { "name": "product2", "price": "10" },
//             { "name": "product3", "price": "30" },
//         ])
//     });