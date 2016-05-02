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
    const lat = sexagesimal(c[0]);
    const long = sexagesimal(c[1]);
    return [long, lat];
  });


  return Object.assign({}, coords, {horizontal});
};

const processedSectors = _.mapValues(rawSectors, (val, key) => {
  return _.mapValues(val, processCoords);
});

debug('Finished processing geo config');
debug(processedSectors);

export const sectors = processedSectors;

export default {
  sectors,
};
