import _ from 'lodash';

const getRaw = (state) => _.get(state, 'advisories');

export const getAdvisoryByIfplId = (state, ifplId) => {
  const advisory = _.get(getRaw(state), ifplId);
  return advisory;
};
