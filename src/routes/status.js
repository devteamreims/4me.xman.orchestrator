import d from 'debug';
const debug = d('4me.xman.status.controller');
import express from 'express';
import _ from 'lodash';


let store;

import {
  getPrettyStatus,
} from '../selectors/status';

function getStatus(req, res, next) {
  res.send(getPrettyStatus(store.getState()));
}


export function getStatusRouter(reduxStore) {
  let router = express.Router();

  if(store === undefined) {
    store = reduxStore;
  }

  router.get('/', getStatus);

  return router;
};
