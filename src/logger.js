import d from 'debug';

const debug = {
  lifecycle: d('4me.lifecycle'),
};

export function lifecycleLogger(...args) {
  return debug['lifecycle'](...args);
}
