export const stubXmanData = {
  lastUpdated: Date.now() - 1000*8, // Last update from XMAN Aggregator
  flights: [{
    flightId: 12345,
    arcid: 'BAW164',
    destination: 'LSZH',
    position: {
      currentFlightLevel: 283,
      plannedFlightLevel: 360,
      rangeToCop: 153,
      when: Date.now() - 10*1000
    },
    cop: 'ABNUR',
    lastUpdated: Date.now() - 10*1000,
    estimatedTimeOverCop: Date.now() + 1000*60*12,
    delay: 2,
    advisory: {
      machReduction: 2,
      speed: null,
      when: Date.now() - 1000*60*4,
      targetTimeOverCop: Date.now() + 1000*60*15
    }
  },{
    flightId: 12346,
    arcid: 'AFR1015',
    destination: 'LSZH',
    cop: 'ABNUR',
    estimatedTimeOverCop: Date.now() + 1000*60*12,
    delay: 12,
    position: {
      currentFlightLevel: 380,
      plannedFlightLevel: 380,
      rangeToCop: 160,
      when: Date.now() - 9*1000
    },
    advisory: {
      machReduction: 0,
      speed: null,
      when: Date.now() - 1000*60*4
    }
  },{
    flightId: 12347,
    arcid: 'MSR777',
    destination: 'EGLL',
    cop: 'ABNUR',
    estimatedTimeOverCop: Date.now() + 1000*60*12,
    delay: 48,
    position: {
      currentFlightLevel: 380,
      plannedFlightLevel: 380,
      rangeToCop: 160,
      when: Date.now() - 9*1000
    },
    advisory: {
      machReduction: 4,
      speed: null,
      when: Date.now() - 1000*60*4
    }
  }]
};

export const stubPositionData = [
    {
      flightId: 12345,
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
      flightId: 12346,
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
      flightId: 12347,
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
    cwpId: 23,
    sectors: ['UF', 'KF'],
  },
  machReduction: 1,
  speed: null,
  minimumCleanSpeed: true
};

