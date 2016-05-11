const verticals = {
  UR: {
    min: 265,
    max: 315,
  },
  XR: {
    min: 315,
    max: 345,
  },
  KR: {
    min: 345,
    max: 365,
  },
  HYR: {
    min: 365,
    max: 660,
  }
};

const LSZH = {
  vertical: {},
  horizontal: {},
};

const EGLL_HORIZONTAL = [
  [3.5550684000000006, 50.4463304],
  [2.75, 49.45],
  [2.1533203, 49.23194730000001],
  [2.9186111, 48.2833333],
  [3.8507080000000005, 47.1299508],
  [6.015014600000001, 47.9605024],
  [7.064209, 49.1457836],
  [5.971069299999999, 49.460983899999995],
  [3.5550684000000006, 50.4463304],
];

const UR = {
  EGLL: {
    vertical: verticals.UR,
    horizontal: EGLL_HORIZONTAL,
  },
  LSZH,
};

const XR = {
  EGLL: {
    vertical: verticals.XR,
    horizontal: EGLL_HORIZONTAL,
  },
  LSZH,
};

const KR = {
  EGLL: {
    vertical: verticals.KR,
    horizontal: EGLL_HORIZONTAL,
  },
  LSZH,
};

const HYR = {
  EGLL: {
    vertical: verticals.HYR,
    horizontal: EGLL_HORIZONTAL,
  },
  LSZH,
};

export default {
  UR,
  XR,
  KR,
  HYR,
};
