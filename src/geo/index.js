import turf from 'turf';
import _ from 'lodash';
import d from 'debug';
const debug = d('4me.geo');

import {
  sectors as sectorCoords,
  captureAreas,
  freezeAreas,
  trackAreas,
} from './coords';

/*
 * rawCoords format :
 * {
 *   lat: XX,
 *   long: YY,
 *   flightLevel: ZZ,
 * }
 */

export function isInSectorArea(sectorName, destinationName, rawCoords) {
  const sector = _.get(sectorCoords, _.toUpper(sectorName));

  if(_.isEmpty(sector)) {
    throw new Error(`${sectorName} : Unknown sector`);
  }

  const destination = _.get(sector, _.toUpper(destinationName));

  if(_.isEmpty(destination)) {
    console.log(`${sectorName} : ${destinationName} is unknown`);
    return false;
  }

  if(_.isEmpty(destination.horizontal)) {
    console.log('Destination has no polygon defined');
    return false;
  }

  const polygon = turf.polygon([destination.horizontal]);

  let point;

  const {
    lat,
    long,
    flightLevel,
  } = rawCoords;

  try {
    point = turf.point([long, lat]);
  } catch(e) {
    console.log('Could not create point from these coords :');
    console.log(rawCoords);
    return false;
  }

  return turf.inside(point, polygon);
}

export function isInSector(sectorName, destinationName, rawCoords) {
  const sector = _.get(sectorCoords, _.toUpper(sectorName));
  const destination = _.get(sector, _.toUpper(destinationName));

  if(_.isEmpty(destination)) {
    console.log(`${sectorName} : ${destinationName} is unknown`);
    return false;
  }

  if(_.isEmpty(destination.vertical)) {
    console.log(`${sectorName} : ${destinationName} has no vertical limits defined`);
    return false;
  }

  const {min, max} = destination.vertical;

  const flightLevel = parseInt(_.get(rawCoords, 'flightLevel'));
  return isInSectorArea(sectorName, destinationName, rawCoords) && _.inRange(flightLevel, min, max);
}


export function isInCaptureArea(destinationName, rawCoords) {
  const destination = _.get(captureAreas, _.toUpper(destinationName));

  if(_.isEmpty(destination)) {
    console.log(`isInCaptureArea : destination ${destinationName} is unknown`);
    return false;
  }

  const polygon = turf.polygon([destination]);

  let point;

  const {
    lat,
    long,
    flightLevel,
  } = rawCoords;

  try {
    point = turf.point([long, lat]);
  } catch(e) {
    console.log('Could not create point from these coords :');
    console.log(rawCoords);
    return false;
  }

  return isInFreezeArea(destinationName, rawCoords) || turf.inside(point, polygon);
}

export function isInFreezeArea(destinationName, rawCoords) {
  const destination = _.get(freezeAreas, _.toUpper(destinationName));

  if(_.isEmpty(destination)) {
    console.log(`isInFreezeArea : destination ${destinationName} is unknown`);
    return false;
  }

  const polygon = turf.polygon([destination]);

  let point;

  const {
    lat,
    long,
    flightLevel,
  } = rawCoords;

  try {
    point = turf.point([long, lat]);
  } catch(e) {
    console.log('Could not create point from these coords :');
    console.log(rawCoords);
    return false;
  }

  return turf.inside(point, polygon);
}

export function isInTrackArea(destinationName, rawCoords) {
  const destination = _.get(trackAreas, _.toUpper(destinationName));

  if(_.isEmpty(destination)) {
    console.log(`isInTrackArea : destination ${destinationName} is unknown`);
    return false;
  }

  const {
    lat,
    long,
    flightLevel,
  } = rawCoords;

  if(flightLevel == 0) {
    return false;
  }

  const polygon = turf.polygon([destination]);

  let point;

  try {
    point = turf.point([long, lat]);
  } catch(e) {
    console.log('Could not create point from these coords :');
    console.log(rawCoords);
    return false;
  }

  return isInCaptureArea(destinationName, rawCoords) || isInFreezeArea(destinationName, rawCoords) || turf.inside(point, polygon);
}
