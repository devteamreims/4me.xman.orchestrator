/**
UE/XE/KE/HE

49°27'11"N , 006°00'25"E
48°57'00"N , 004°48'00"E
48°15'00"N , 005°44'00"E
47°59'00"N , 006°00'00"E
47°55'00"N , 006°30'00"E
48°00'00"N , 006°36'00"E
47°49'56"N , 007°33'24"E
Frontière franco-allemande
Frontière franco-luxembourgeoise
49°27'11"N , 006°00'25"E
*/

const EGLL = {
  horizontal: {},
  vertical: {},
};

const horizontal = [
  ['49°27\'11"N', '006°00\'25"E'],
  ['48°57\'00"N', '004°48\'00"E'],
  ['48°15\'00"N', '005°44\'00"E'],
  ['47°59\'00"N', '006°00\'00"E'],
  ['47°55\'00"N', '006°30\'00"E'],
  ['48°00\'00"N', '006°36\'00"E'],
  ['47°49\'56"N', '007°33\'24"E'],
  ['49°27\'11"N', '006°00\'25"E'],
];

const UE = {
  EGLL,
  LSZH: {
    vertical: {
      min: 225,
      max: 315,
    },
    horizontal,
  },
};

const XE = {
  EGLL,
  LSZH: {
    vertical: {
      min: 315,
      max: 345,
    },
  },
};

const KE = {
  EGLL,
  LSZH: {
    vertical: {
      min: 345,
      max: 365,
    },
  },
};

const HE = {
  EGLL,
  LSZH: {
    vertical: {
      min: 365,
      max: 660,
    },
  },
};

export default {
  UE,
  XE,
  KE,
  HE,
};
