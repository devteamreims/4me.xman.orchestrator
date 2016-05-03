const verticals = {
  UN: {
    min: 265,
    max: 345,
  },
  UB: {
    min: 265,
    max: 345,
  },
  KN: {
    min: 345,
    max: 365,
  },
  HN: {
    min: 365,
    max: 660,
  },
};

const EGLL_HORIZONTAL = [
  [2.8298990999999996, 48.459629899999996],
  [6.006944400000001, 49.453055600000006],
  [2.043457, 51.0310311],
  [0.7697222, 50.4013889],
  [1.9720458999999995, 49.4788324],
  [2.8298990999999996, 48.459629899999996],
];

const LSZH = {
  vertical: {},
  horizontal: {},
};

const UN = {
  EGLL: {
    horizontal: EGLL_HORIZONTAL,
    vertical: verticals.UN,
  },
  LSZH,
};

const UB = {
  EGLL: {
    horizontal: EGLL_HORIZONTAL,
    vertical: verticals.UB,
  },
  LSZH,
};

const KN = {
  EGLL: {
    horizontal: EGLL_HORIZONTAL,
    vertical: verticals.KN,
  },
  LSZH,
};

const HN = {
  EGLL: {
    horizontal: EGLL_HORIZONTAL,
    vertical: verticals.HN,
  },
  LSZH,
};

export default {
  UB,
  UN,
  KN,
  HN,
};
