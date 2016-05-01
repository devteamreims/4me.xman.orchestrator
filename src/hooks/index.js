import _ from 'lodash';
import moment from 'moment';
import d from 'debug';
const debug = d('4me.hooks');


import {
  flightToString,
} from '../utils/flight';

import {
  lifecycleLogger,
} from '../logger';

// API

// shouldAddFlight(flight)
// shouldUpdateAdvisory(flight, oldAdvisory, newAdvisory)


export function shouldAddFlight(flight) {
  const destination = _.get(flight, 'destination');
  const cop = _.get(flight, 'cop');
  const etoCop = moment.utc(_.get(flight, 'advisory.estimatedTime'));
  const delay = _.get(flight, 'delay');

  if(destination === 'EGLL') {

    const timeCutOff = moment.utc().add(60, 'minutes');

    if(cop !== 'ABNUR') {
      lifecycleLogger(`Reject flight ${flightToString(flight)} : COP is ${cop}`);
      return false;
    }

    if(delay === -1) {
      lifecycleLogger(`Reject flight ${flightToString(flight)} : Total delay is -1, flight hasn't been captured by AMAN yet`);
      return false;
    }


    if(etoCop.isAfter(timeCutOff)) {
      lifecycleLogger(`Reject flight ${flightToString(flight)} : TTO is ${etoCop}, cutoff is ${timeCutOff}`);
      return false;
    }

    // Some logic to reject flights here
    return true;
  }
  return false;
}

export function shouldAdvisoryUpdate(flight, oldAdvisory, newAdvisory) {
  const destination = _.get(flight, 'destination');
  const isFlightCaptured = _.get(flight, 'captured');

  if(!isFlightCaptured) {
    // Flight is not captured, update advisory
    return true;
  }

  if(destination === 'EGLL') {
    if(oldAdvisory.machReduction < newAdvisory.machReduction) {
      lifecycleLogger(`New speed advisory for flight ${flightToString(flight)} : ${oldAdvisory.delay}/-${oldAdvisory.machReduction} => ${newAdvisory.delay}/-${newAdvisory.machReduction}`);
      return true;
    }

    lifecycleLogger(`Rejecting speed advisory for flight ${flightToString(flight)} : ${oldAdvisory.delay}/-${oldAdvisory.machReduction} => ${newAdvisory.delay}/-${newAdvisory.machReduction}`)
    return false;
  }

  // Defaults to false
  return false;
}

export function prepareAdvisory(flight, advisory) {
  const destination = _.get(flight, 'destination');

  if(destination === 'EGLL') {
    const getMachReduction = () => {
      const delay = _.get(advisory, 'delay', 0);
      switch(true) {
        case (delay >= 60*3):
          return 4;
        case (delay > 60*2):
          return 3;
        case (delay > 60*1):
          return 2;
        case (delay > 30):
          return 1;
        default:
          return 0;
      }
    };
    return Object.assign({}, advisory, {machReduction: getMachReduction()});
  }

  return advisory;
}

export function shouldFlightBeCaptured(flight) {
  const destination = _.get(flight, 'destination');

  console.log(flight);

  if(destination === 'EGLL') {
    const flightLevel = _.get(flight, 'position.vertical.currentFlightLevel');
    if(flightLevel >= 380) {
      return true;
    }
    // Introduce some sort of geo filtering here
    return false;
  }

  return false;
}
