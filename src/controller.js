import d from 'debug';
const debug = d('4me.xman.controller');
import express from 'express';
import _ from 'lodash';

import {
  getFlightsWithData,
  getFlightsInFilterWithData,
  getSortedFlightsInFilterWithData
} from './selectors/flight';

let store;

function isInSectorArea(sector, flight) {
  const flights = ['BAW82', 'MSR777', 'AFR1015', 'EZY1002'];

  if(_.includes(flights, flight.arcid) && sector[1] === 'R') {
    return true;
  }
  return false;
}

function isInSectorVerticalArea(sector, flight) {
  const verticalLimits = [345, 365];

  const currentFlightLevel = _.get(flight, 'position.vertical.currentFlightLevel', 0);

  return _.inRange(currentFlightLevel, ...verticalLimits);
}

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

  const inSectors = (sectors) => {
    debug('Creating sector filter for sectors :');
    debug(sectors);
    return (flight) => {
      if(_.isEmpty(sectors)) {
        // No sectors specified, return full list
        return true;
      }

      debug(`Computing presence of ${flight.arcid} in sectors`);
      const curry = (sector) => {
        if(!verticalFilter) {
          debug('verticalFilter is false !');
          return isInSectorArea(sector, flight);
        }

        return isInSectorVerticalArea(sector, flight) && isInSectorArea(sector, flight);
      };

      return _.some(sectors, curry);
    };
  };

  const formattedResults = _(getSortedFlightsInFilterWithData(store.getState(), {sectors, verticalFilter}))
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