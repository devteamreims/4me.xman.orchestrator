import turf from 'turf';
import sexagesimal from 'sexagesimal';

import _ from 'lodash';


import sectors from './config/sectors';

console.log(sectors);


const processCoords = coords => {
  if(_.isEmpty(coords.horizontal) || !_.isArray(coords.horizontal)) {
    return Object.assign({}, coords, {vertical: coords.vertical, horizontal: {}});
  }

  const horizontal = _.map(coords.horizontal, c => {
    const lat = sexagesimal(c[0]);
    const long = sexagesimal(c[1]);
    return [lat, long];
  });


  return Object.assign({}, coords, {horizontal});
};

const processed = _.mapValues(sectors, (val, key) => {
  return _.mapValues(val, processCoords);
});

console.log(processed);

export function isInSector(sectorName, destinationName, rawCoords) {
  const sector = _.get(processed, _.toUpper(sectorName));

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
  const sector = _.get(processed, _.toUpper(sectorName));

  if(_.isEmpty(sector)) {
    throw new Error(`${sectorName} : Unknown sector`);
  }

  const destination = _.get(sector, _.toUpper(destinationName));

  if(_.isEmpty(destination)) {
    console.log(`${sectorName} : ${destinationName} is unknown`);
    return true;
  }

  flightLevel = parseInt(flightLevel);

  return flightLevel >= destination.vertical.max && flightLevel <= destination.vertical.min;
}

const testCoords = [
  [49.3414, 5.1277], // Inside UR
  [49.7865, 2.3127], // Outside UR
];

console.log(isInSector('UR', 'lszh', testCoords[1]));

