import d from 'debug';
const debug = d('4me.flightList.actions');
import _ from 'lodash';
import moment from 'moment';

import {normalize, Schema, arrayOf} from 'normalizr';

import {stubXmanData} from '../stubData';

import {getSocket} from '../socket';

export const SET_FLIGHT_LIST = 'SET_FLIGHT_LIST';
export const ASSOCIATE_FLIGHTS_WITH_POSITIONS = 'ASSOCIATE_FLIGHTS_WITH_POSITIONS'; 


let advisoryId = 0;

function getAdvisoryId() {
  return advisoryId++;
}

const flight = new Schema('flights', {idAttribute: 'flightId'});
const advisory = new Schema('advisories', {idAttribute: getAdvisoryId});

flight.define({
  advisory: advisory
});


export function updateFlightList(data) {
  // Process data for updating, this is our main refresh point
  // We diff the existing flightList with the provided flightList
  // Unknown flights are added, removed flights are trashed, other flights are updated
  return (dispatch, getState) => {

    let normalizedData = normalize(data, {
      flights: arrayOf(flight)
    });

    debug('Currently tracking %d flights, got %d flights from backend', getState().flightList.flights.length, _.keys(normalizedData.entities.flights).length);
    debug('Backend was updated %s', moment(normalizedData.result.lastUpdated).fromNow());

    d('4me.normalizr')(normalizedData);
    dispatch(setFlightListAction(normalizedData));
  }
}

export function associateFlightsWithPositions(assocArray) {
  // assocArray is in this form : [{flightId: XX, positionId: YY}]
  return (dispatch, getState) => {
    const knownFlightIds = _.keys(getState().flightList.flights);
    const knownPositionIds = _.keys(getState().positions);
    const updatedFlightIds = _.map(assocArray, a => a.flightId);
    const updatedPositionIds = _.map(assocArray, a.positionId);

    const unknownFlightIds = _.without(updatedFlightIds, ...knownFlightIds);
    if(!_.isEmpty(unknownFlightIds)) {
      debug('WARNING: Trying to association positions to unknown flights [%s]', unknownFlightIds.join(','));
    }

    const unknownPositionIds = _.without(updatedPositionIds, ...knownPositionIds);
    if(!_.isEmpty(unknownPositionIds)) {
      debug('WARNING: Trying to association positions to unknown flights [%s]', unknownPositionIds.join(','));
    }

    dispatch({
      type: ASSOCIATE_FLIGHTS_WITH_POSITIONS,
      data: assocArray
    });
  }
}

export function firstStep() {
  return updateFlightList(stubXmanData);
}

export function setFlightListAction(data) {
  return {
    type: SET_FLIGHT_LIST,
    data: data
  };
}