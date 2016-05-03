const EGLL_HORIZONTAL = [
  [8.4407684, 47.6437327],
  [8.8907102, 48.9219646],
  [7.1344344, 49.1019023],
  [5.844682100000001, 49.5952839],
  [4.6317668, 49.083929700000006],
  [5.892627, 48.5418058],
  [6.433410800000001, 48.2912122],
  [8.4407684, 47.6437327],
];

const verticals = {
  UE: {
    min: 225,
    max: 315,
  },
  XE: {
    min: 315,
    max: 345,
  },
  KE: {
    min: 345,
    max: 365,
  },
  HE: {
    min: 365,
    max: 660,
  },
};

const LSZH = {
  vertical: {},
  horizontal: {},
};

const UE = {
  EGLL: {
    horizontal: EGLL_HORIZONTAL,
    vertical: verticals.UE,
  },
  LSZH,
};

const XE = {
  EGLL: {
    horizontal: EGLL_HORIZONTAL,
    vertical: verticals.XE,
  },
  LSZH,
};

const KE = {
  EGLL: {
    horizontal: EGLL_HORIZONTAL,
    vertical: verticals.KE,
  },
  LSZH,
};

const HE = {
  EGLL: {
    horizontal: EGLL_HORIZONTAL,
    vertical: verticals.HE,
  },
  LSZH,
};

export default {
  UE,
  XE,
  KE,
  HE,
};
