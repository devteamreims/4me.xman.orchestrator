import d from 'debug';
const debug = d('4me.xman.controller');
import express from 'express';
import _ from 'lodash';

let store;

function getFlights(req, res, next) {
  const defaultPosition = {
    when: Date.now(),
    vertical: {
      plannedFlightLevel: 0,
      currentFlightLevel: 0
    },
    horizontal: {
      lat: 0,
      long: 0
    }
  };
  
  const formattedResults = _.map(store.getState().flightList.flights,
    f => {
      return Object.assign({}, f, {
        advisory: store.getState().advisories[f.advisory] || {},
        currentStatus: store.getState().currentStatuses[f.flightId] || {},
        position: store.getState().positions.positions[f.flightId] || defaultPosition
      });
    }
  );

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