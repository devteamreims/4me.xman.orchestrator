import turf from 'turf';
import _ from 'lodash';

import {
  sectors as sectorCoords
} from './coords';

export function isInSector(sectorName, destinationName, rawCoords) {
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

  try {
    point = turf.point(rawCoords);
  } catch(e) {
    console.log('Could not create point from these coords :');
    console.log(rawCoords);
    return false;
  }

  return turf.inside(point, polygon);
}

export function isInVerticalSector(sectorName, destinationName, flightLevel) {
  const sector = _.get(sectorCoords, _.toUpper(sectorName));

  if(_.isEmpty(sector)) {
    throw new Error(`${sectorName} : Unknown sector`);
  }

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

  flightLevel = parseInt(flightLevel);

  console.log(`Comparing current FL : ${flightLevel} with min: ${min}, max: ${max}`);

  return _.inRange(flightLevel, min, max);
}
