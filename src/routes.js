import express from 'express';

import {getXmanRouter} from './controller';

import {updateFlights} from './actions/flight-list';

const routes = function(store) {

  let router = express.Router();

  router.use('/xman', getXmanRouter(store));

  router.get('/getState', getStateController(store));

  router.get('/status', getStatusController(store));

  return router;
};

function getStateController(store) {
  return (req, res, next) => {
    res.send(store.getState());
  };
}

import {
  getPrettyStatus,
} from './selectors/status';

function getStatusController(store) {
  return (req, res, next) => {
    res.send(getPrettyStatus(store.getState()));
  };
}

export default routes;
