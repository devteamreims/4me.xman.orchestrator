/**

UH/XH/KH/HH:
47°49'56"N , 007°33'24"E
48°00'00"N , 006°36'00"E
47°55'00"N , 006°30'00"E
47°59'00"N , 006°00'00"E
47°28'00"N , 005°47'00"E
46°58'12"N , 005°57'47"E
47°04'00"N , 006°18'00"E
47°04'12"N , 006°42'02"E
Frontière franco-suisse
Frontière franco-allemande
47°49'56"N , 007°33'24"E

*/

const EGLL = {
  horizontal: {},
  vertical: {},
};

const horizontal = [
  ['47°49\'56"N', '007°33\'24"E'],
  ['48°00\'00"N', '006°36\'00"E'],
  ['47°55\'00"N', '006°30\'00"E'],
  ['47°59\'00"N', '006°00\'00"E'],
  ['47°28\'00"N', '005°47\'00"E'],
  ['46°58\'12"N', '005°57\'47"E'],
  ['47°04\'00"N', '006°18\'00"E'],
  ['47°04\'12"N', '006°42\'02"E'],
  ['47°49\'56"N', '007°33\'24"E'],
];

const UH = {
  EGLL,
  LSZH: {
    vertical: {
      min: 225,
      max: 315,
    },
    horizontal,
  },
};

const XH = {
  EGLL,
  LSZH: {
    vertical: {
      min: 315,
      max: 345,
    },
  },
};

const KH = {
  EGLL,
  LSZH: {
    vertical: {
      min: 345,
      max: 365,
    },
  },
};

const HH = {
  EGLL,
  LSZH: {
    vertical: {
      min: 365,
      max: 660,
    },
  },
};

export default {
  UH,
  XH,
  KH,
  HH,
};
