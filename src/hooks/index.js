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

    // TODO : Clarify delay="NIL" in XML with London
    /*
    if(delay === -1) {
      lifecycleLogger(`Reject flight ${flightToString(flight)} : Total delay is -1, flight hasn't been captured by AMAN yet`);
      return false;
    }
    */

    if(etoCop.isAfter(timeCutOff)) {
      lifecycleLogger(`Reject flight ${flightToString(flight)} : TTO is ${etoCop}, cutoff is ${timeCutOff}`);
      return false;
    }

    // Some logic to reject flights here
    return true;
  }
  return false;
}

export function shouldAdvisoryUpdate(stateFlight, newFlight, oldAdvisory, newAdvisory) {
  const destination = _.get(newFlight, 'destination');
  const isFlightCaptured = _.get(stateFlight, 'captured', false);
  const isFlightFrozen = _.get(stateFlight, 'frozen', false);

  if(isFlightFrozen) {
    // Frozen flight, discard any new advisory
    return false;
  }

  if(!isFlightCaptured) {
    // Flight is not captured, update advisory
    return true;
  }

  if(destination === 'EGLL') {
    if(oldAdvisory.machReduction <= newAdvisory.machReduction) {
      return true;
    }

    lifecycleLogger(`[${flightToString(newFlight)}] Rejecting advisory ${oldAdvisory.delay}/-${oldAdvisory.machReduction} => ${newAdvisory.delay}/-${newAdvisory.machReduction}`)
    return false;
  }

  // Defaults to false
  return false;
}

function isNightTime(flight, advisory) {
  const rawTto = _.get(advisory, 'targetTime');
  const tto = moment.utc(rawTto);

  const nightStart = tto.isDST() ? moment.utc(rawTto).hours(22).startOf('hour') : moment.utc(rawTto).hours(21).startOf('hour');
  const nightEnd = tto.isDST() ? moment.utc(rawTto).hours(6).minutes(30).startOf('minute') : moment.utc(rawTto).hours(5).minutes(30).startOf('minute');

  const isNight = !(tto.isBefore(nightStart) && tto.isAfter(nightEnd));
  if(isNight) {
    debug(
      '[%s] TTO is %s : Night mode',
      flightToString(flight),
      tto.format()
    );
  }

  return !(tto.isBefore(nightStart) && tto.isAfter(nightEnd));
}

export function prepareAdvisory(flight, advisory) {
  const destination = _.get(flight, 'destination');

  if(destination === 'EGLL') {
    const getMachReduction = () => {
      const delay = _.get(advisory, 'delay', 0);
      const tto = moment(_.get(advisory, 'targetTime'));

      // Implement sleep mode here
      if(isNightTime(flight, advisory)) {
        return 0;
      }

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

import {
  isInCaptureArea,
  isInFreezeArea,
  isInTrackArea,
} from '../geo';

export function shouldFlightBeCaptured(flight) {
  const destination = _.get(flight, 'destination');

  if(destination === 'EGLL') {
    const flightLevel = _.get(flight, 'position.vertical.currentFlightLevel');
    const {lat, long} = _.get(flight, 'position.horizontal', {lat: 0, long: 0});

    return isInCaptureArea(destination, {lat, long, flightLevel});
  }

  return false;
}

export function shouldFlightBeFrozen(flight) {
  const destination = _.get(flight, 'destination');

  if(destination === 'EGLL') {
    const flightLevel = _.get(flight, 'position.vertical.currentFlightLevel');
    const {lat, long} = _.get(flight, 'position.horizontal', {lat: 0, long: 0});

    return isInFreezeArea(destination, {lat, long, flightLevel});
  }

  return false;
}

export function shouldFlightBeTracked(flight) {
  const destination = _.get(flight, 'destination');

  if(destination === 'EGLL') {
    const flightLevel = _.get(flight, 'position.vertical.currentFlightLevel');
    const {lat, long} = _.get(flight, 'position.horizontal', {lat: 0, long: 0});

    return isInTrackArea(destination, {lat, long, flightLevel});
  }

  return false;

}
