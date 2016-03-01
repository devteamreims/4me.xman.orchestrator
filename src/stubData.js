import _ from 'lodash';
import d from 'debug';
const debug = d('4me.STUBDATA');

export const stubXmanData = {
  lastFetched: Date.now() - 1000*8, // Last update from XMAN Aggregator
  flights: [
  {
    flightId: 'a12344',
    arcid: 'BAW82',
    destination: 'EGLL',
    cop: 'ABNUR',
    lastUpdated: Date.now() - 10*1000,
    estimatedTimeOverCop: Date.now() + 1000*60*15,
    delay: 21,
    advisory: {
      machReduction: 4,
      speed: null,
      when: Date.now() - 1000*60*4,
      targetTimeOverCop: Date.now() + 1000*60*15
    },
    captureTime: Date.now() - 1000*60*10
  }, {
    flightId: 'a12345',
    arcid: 'BAW164',
    destination: 'EGLL',
    cop: 'ABNUR',
    lastUpdated: Date.now() - 10*1000,
    estimatedTimeOverCop: Date.now() + 1000*60*12,
    delay: 2,
    advisory: {
      machReduction: 2,
      speed: null,
      when: Date.now() - 1000*60*4,
      targetTimeOverCop: Date.now() + 1000*60*15
    },
    captureTime: Date.now() - 1000*60*8
  },{
    flightId: 'a12346',
    arcid: 'AFR1015',
    destination: 'LSZH',
    cop: 'BLM',
    lastUpdated: Date.now() - 10*1000,
    estimatedTimeOverCop: Date.now() + 1000*60*12,
    delay: 12,
    advisory: {
      machReduction: null,
      speed: 260,
      when: Date.now() - 1000*60*4,
      targetTimeOverCop: Date.now() + 1000*60*15
    },
    captureTime: Date.now() - 1000*60*6
  },{
    flightId: 'a12347',
    arcid: 'MSR777',
    destination: 'EGLL',
    cop: 'ABNUR',
    lastUpdated: Date.now() - 10*1000,
    estimatedTimeOverCop: Date.now() + 1000*60*12,
    delay: 48,
    advisory: {
      machReduction: 4,
      speed: null,
      when: Date.now() - 1000*60*4,
      targetTimeOverCop: Date.now() + 1000*60*15
    },
    captureTime: Date.now() - 1000*60*4
  }]
};

const otherXmanFlight = {
  flightId: 'a12348',
  arcid: 'EZY1002',
  destination: 'EGLL',
  cop: 'ABNUR',
  lastUpdated: Date.now() - 10*1000,
  estimatedTimeOverCop: Date.now() + 1000*60*12,
  delay: 12,
  advisory: {
    machReduction: 3,
    speed: null,
    when: Date.now() - 1000*60*4,
    targetTimeOverCop: Date.now() + 1000*60*15
  }
};

export function stubXmanDataMinusOne(data = stubXmanData) {
  const byArcid = (arcid) => (f) => f.arcid === arcid;
  const updateLastUpdated = (f) => _.merge({}, f, {lastUpdated: Date.now()});

  const flights = [
    ..._.chain( data.flights )
      .reject(byArcid('MSR777'))
      .reject(byArcid('AFR1015'))
      .map(updateLastUpdated)
      .value(),
    ..._.chain(data.flights)
      .filter(byArcid('AFR1015'))
  ];

  return _.merge({}, _.omit(data, 'flights'), {flights});
}

export function stubXmanDataPlusOne(data = stubXmanData) {

  const flights = [
    ...data.flights,
    otherXmanFlight
  ];

  return _.merge({}, _.omit(data, 'flights'), {flights});
}

export const stubPositionData = () => [
    {
      flightId: 'a12344',
      vertical: {
        currentFlightLevel: 360,
        plannedFlightLevel: 360
      },
      horizontal: {
        // Overhead RLP
        lat: 47.956465,
        long: 5.294205
      },
      when: Date.now() - 10*1000
    },
    {
      flightId: 'a12345',
      vertical: {
        currentFlightLevel: 283,
        plannedFlightLevel: 360
      },
      horizontal: {
        // Overhead RLP
        lat: 47.956465,
        long: 5.294205
      },
      when: Date.now() - 10*1000
    },{
      flightId: 'a12346',
      vertical: {
        currentFlightLevel: 310,
        plannedFlightLevel: 330
      },
      horizontal: {
        // Overhead PILON
        lat: 48.0019444,
        long: 5.69194444
      },
      when: Date.now() - 10*1000
    },{
      flightId: 'a12347',
      vertical: {
        currentFlightLevel: 380,
        plannedFlightLevel: 380
      },
      horizontal: {
        // Overhead KOTUN
        lat: 48.7244444,
        long: 3.87111111
      },
      when: Date.now() - 45*1000
    }
];

export const stubCurrentStatus = {
  when: Date.now(),
  who: {
    cwp: {
      id: 23,
      name: 'P23'
    },
    sectors: ['UF', 'KF'],
  },
  machReduction: 1,
  speed: null,
  minimumCleanSpeed: true
};

