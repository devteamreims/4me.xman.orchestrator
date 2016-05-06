import d from 'debug';
const debug = d('4me.xman.status.controller');
import express from 'express';
import _ from 'lodash';


let store;

import {
  getPrettyStatus,
  getFetchers,
  getSingleFetcher as getSingleFetcherSelector,
} from '../selectors/status';

function getStatus(req, res, next) {
  res.send(getPrettyStatus(store.getState()));
}

function getFetcherStatuses(req, res, next) {
  res.send(getFetchers(store.getState()));
}

function getSingleFetcher(req, res, next) {
  const fetcher = _.toUpper(_.get(req.params, 'fetcher'));
  try {
    const toSend = getSingleFetcherSelector(store.getState(), fetcher);
    res.send(toSend);
  } catch(err) {
    err.status = 404;
    next(err);
  }
}

import {
  setFetcherStatus,
} from '../actions/status';

function putSingleFetcher(req, res, next) {
  const fetcher = _.toUpper(_.get(req.params, 'fetcher'));

  try {
    getSingleFetcherSelector(store.getState(), fetcher);
  } catch(err) {
    err.status = 404;
    return next(err);
  }

  const status = _.pick(req.body, ['forceOff', 'forceMcs']);

  store.dispatch(setFetcherStatus(fetcher, status));

  res.send(JSON.stringify('OK'));
}

export function getStatusRouter(reduxStore) {
  let router = express.Router();

  if(store === undefined) {
    store = reduxStore;
  }

  router.get('/', getStatus);
  router.get('/fetchers', getFetcherStatuses);
  router.get('/fetchers/:fetcher', getSingleFetcher);
  router.put('/fetchers/:fetcher', putSingleFetcher);

  return router;
};
