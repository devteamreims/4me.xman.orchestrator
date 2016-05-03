import {
  getFetchers,
} from './fetchers';

export function getConfig() {
  return {
    fetchers: getFetchers(),
  };
}

import captureAreas from './captureAreas';
import freezeAreas from './freezeAreas';
import trackAreas from './trackAreas';

export const areas = {
  captureAreas,
  freezeAreas,
  trackAreas,
};
