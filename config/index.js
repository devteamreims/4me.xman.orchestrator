import {
  getFetchers,
} from './fetchers';

export function getConfig() {
  return {
    fetchers: getFetchers(),
  };
}
