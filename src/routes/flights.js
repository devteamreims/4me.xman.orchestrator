import d from 'debug';
const debug = d('4me.xman.flights.controller');
import express from 'express';
import _ from 'lodash';

import {
  getSortedFlightsInFilterWithData,
} from '../selectors/flight';

let store;

function getFlights(req, res, next) {
  let destFilter = [];
  if(req.query.destinations !== undefined) {
    destFilter = req.query.destinations;
  }

  let sectors = [];
  let verticalFilter = false;
  if(req.query.sectors !== undefined) {
    sectors = req.query.sectors;
    verticalFilter = !!req.query.verticalFilter;
  }

  const filterByDest = f => _.isEmpty(destFilter) || _.includes(destFilter, f.destination);

  const formattedResults = _(getSortedFlightsInFilterWithData(store.getState(), {sectors, verticalFilter}))
    .filter(filterByDest)
    .value();

  res.send(formattedResults);
}



export function getFlightsRouter(reduxStore) {
  let router = express.Router();

  if(store === undefined) {
    store = reduxStore;
  }

  router.get('/', getFlights);

  return router;
};
