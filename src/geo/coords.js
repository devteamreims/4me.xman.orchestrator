import sexagesimal from 'sexagesimal';
import _ from 'lodash';
import d from 'debug';
const debug = d('4me.geo.coords');

import rawSectors from '../../config/sectors';

function processCoords(coords) {
  if(_.isEmpty(coords.horizontal) || !_.isArray(coords.horizontal)) {
    return Object.assign({}, coords, {vertical: coords.vertical, horizontal: {}});
  }

  const horizontal = _.map(coords.horizontal, c => {
    let [long, lat] = c;

    if(typeof c[0] === "string") {
      long = sexagesimal(c[0]);
    }

    if(typeof c[1] === "string") {
      lat = sexagesimal(c[1]);
    }

    return [long, lat];
  });


  return Object.assign({}, coords, {horizontal});
};

const processedSectors = _.mapValues(rawSectors, (val, key) => {
  return _.mapValues(val, processCoords);
});

debug('Finished processing geo config');
debug(processedSectors);
debug(processedSectors.KN.EGLL.horizontal);


export const sectors = processedSectors;

import {
  areas,
} from '../../config';


export const captureAreas = areas.captureAreas;
export const freezeAreas = areas.freezeAreas;
export const trackAreas = areas.trackAreas;
