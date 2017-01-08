import _ from 'lodash';
import d from 'debug';
const debug = d('4me.geo');

import { xman as xmanEnv } from '../env';


/*
 * rawCoords format :
 * {
 *   lat: XX,
 *   long: YY,
 *   flightLevel: ZZ,
 * }
 */
const normalizePosition = rawCoords => ({
  long: rawCoords.long || 0,
  lat: rawCoords.lat || 0,
  altitude: (rawCoords.flightLevel || 0) * 100,
});

export function isInSectorArea(sectorName, destinationName, rawCoords) {
  const position = normalizePosition(rawCoords);
  if(!position.long && !position.lat) {
    return false;
  }
  const destination = _.toUpper(destinationName);

  return xmanEnv.isInGeoSector(destination, sectorName, position);
}

export function isInSector(sectorName, destinationName, rawCoords) {
  const position = normalizePosition(rawCoords);
  if(!position.long && !position.lat) {
    return false;
  }
  const destination = _.toUpper(destinationName);

  return xmanEnv.isInSector(destination, sectorName, position);
}


export function isInCaptureArea(destinationName, rawCoords) {
  const position = normalizePosition(rawCoords);
  if(!position.long && !position.lat) {
    return false;
  }
  const destination = _.toUpper(destinationName);

  return xmanEnv.isCaptured(destination, position);
}

export function isInFreezeArea(destinationName, rawCoords) {
  const position = normalizePosition(rawCoords);
  if(!position.long && !position.lat) {
    return false;
  }
  const destination = _.toUpper(destinationName);

  return xmanEnv.isFrozen(destination, position);
}

export function isInTrackArea(destinationName, rawCoords) {
  const position = normalizePosition(rawCoords);
  if(!position.long && !position.lat) {
    return false;
  }
  const destination = _.toUpper(destinationName);

  return xmanEnv.isTracked(destination, position);
}
