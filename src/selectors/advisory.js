import _ from 'lodash';

export const getMachReductionFromAdvisory = (advisory) => {
  const delay = _.get(advisory, 'delay', 0);
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
