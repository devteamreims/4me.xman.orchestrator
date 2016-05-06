import express from 'express';

import {getFlightsRouter} from './flights';
import {getStatusRouter} from './status';

export default function getRoutes(store) {

  let router = express.Router();

  router.use('/flights', getFlightsRouter(store));
  router.use('/status', getStatusRouter(store));

  router.get('/getState', getStateController(store));

  return router;
};

function getStateController(store) {
  return (req, res, next) => {
    res.send(store.getState());
  };
}
