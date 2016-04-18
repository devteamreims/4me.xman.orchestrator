import _ from 'lodash';
import moment from 'moment';


// API

// shouldAddFlight(flight)
// shouldUpdateAdvisory(flight, oldAdvisory, newAdvisory)


export function shouldAddflight(flight) {
  const destination = _.get(flight, 'destination');

  if(destination === 'EGLL') {
    // Some logic to reject flights here
    return true;
  }
  return false;
}

export function shouldUpdateAdvisory(flight, oldAdvisory, newAdvisory) {
  const destination = _.get(flight, 'destination');

  if(destination === 'EGLL') {
    // Logic here
  }

  // Defaults to false
  return false;
}
