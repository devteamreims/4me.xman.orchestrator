import express from 'express';

import {getXmanRouter} from './controller';

const routes = function(store) {

  let router = express.Router();

  router.use('/xman', getXmanRouter(store));

  return router;
};

export default routes;