import _ from 'lodash';

const getRaw = (state) => _.get(state, 'advisories');

// Unused
export const getMachReductionFromAdvisory = (advisory) => {
  const delay = _.get(advisory, 'delay', 0) + 60*10;
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
}


export const getAdvisoryByIfplId = (state, ifplId) => _.get(getRaw(state), ifplId);
