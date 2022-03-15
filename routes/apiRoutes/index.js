// will act as a central hub to pull all the different routes in each routes file together

const express = require('express');
const indexRouter = express.Router();

// import candidate routes
indexRouter.use(require('./candidateRoutes'));
indexRouter.use(require('./partyRoutes'));

module.exports = indexRouter;