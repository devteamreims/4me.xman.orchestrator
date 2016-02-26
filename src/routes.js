import express from 'express';

import {getXmanRouter} from './controller';

const routes = function(store) {

  let router = express.Router();

  router.use('/xman', getXmanRouter(store));

  router.get('/getState', getStateController(store));

  return router;
};

function getStateController(store) {
  return (req, res, next) => {
    res.send(store.getState());
  };
}

export default routes;