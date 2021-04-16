"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var app = express();

var config = require('./../configs');

var port = config.server.port;

var apiRouter = require('./../routes');

var schema = require('./../apollo/schemas');

var resolvers = require('./../apollo/resolvers');

var _require = require('apollo-server-express'),
    ApolloServer = _require.ApolloServer,
    gql = _require.gql;

var cors = require('cors');

var graphQLServer = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
  formatError: function formatError(err) {
    console.log(err);
    return {
      message: err.message,
      status: err.status
    };
  }
});
graphQLServer.applyMiddleware({
  app: app,
  path: '/graphql'
});
app.use(bodyParser.json());
app.use(cors());
app.use('/api/v1', apiRouter); // const path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));
// express.static('./../public');

app.use('/public', express["static"]('public'));

exports.start = function () {
  // app.listen(port, '192.168.1.75', (err) => {
  //     if (err) {
  //         console.log(`Error : ${err}`);
  //         process.exit(-1);
  //     }
  //     console.log(`App is running on  port ${port}`);
  // });
  app.listen(port, function (err) {
    if (err) {
      console.log("Error : ".concat(err));
      process.exit(-1);
    }

    console.log("App is running on  port ".concat(port));
  });
};
//# sourceMappingURL=server.service.js.map