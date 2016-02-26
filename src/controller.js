import d from 'debug';
const debug = d('4me.xman.controller');
import express from 'express';
import _ from 'lodash';

import {combineFlightData} from './utils/flight';

let store;

function getFlights(req, res, next) {
  let destFilter = [];
  if(req.query.destinations !== undefined) {
    destFilter = req.query.destinations;
  }

  const filterByDest = f => _.isEmpty(destFilter) || _.includes(destFilter, f.destination);

  const combineData = (flight, flightId) => combineFlightData(store.getState(), flightId);

  const formattedResults = _(store.getState().flightList.flights)
    .map(combineData)
    .filter(filterByDest)
    .value();

  res.send(formattedResults);
}



function getXmanController() {
  return {
    getFlights: getFlights
  };
}

export function getXmanRouter(reduxStore) {
  let router = express.Router();

  if(store === undefined) {
    store = reduxStore;
  }

  let xmanController = getXmanController();

  router.get('/', xmanController.getFlights);

  return router;
};