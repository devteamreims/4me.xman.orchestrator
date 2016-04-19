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

  if(destination === 'EGLL') {

    const timeCutOff = moment.utc().add(60, 'minutes');

    if(cop !== 'ABNUR') {
      lifecycleLogger(`Reject flight ${flightToString(flight)} : COP is ${cop}`);
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
    const getDelay = () => {
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
    return Object.assign({}, advisory, {machReduction: getDelay()});
  }

  return advisory;
}
