const date = new Date();
const xmanFlights = {
  messageTime: date.toJSON(),
  total: 1,
  flights: [
    {
      ifplId: "AA56721254",
      destination: "EGLL",
      arcid: "AMC100A",
      cop: "ABNUR",
      delay: 298,
      advisory: {
        targetTime: "2016-09-17T07:51:55Z",
        estimatedTime: "2016-09-17T07:51:55Z",
        delay: 0,
        smoothedDelay: 0
      }
    },
  ],
  amanState: {
    FPL: {
      state: "OK",
      description: ""
    },
    METEO: {
      state: "OK",
      description: ""
    },
    TRACK: {
      state: "OK",
      description: ""
    }
  },
  airportState: { }
};

const positions = {
  lastFetched: Date.now(),
  flights: [{
    callsign: 'AMC100A',
    lat: 0,
    long: 0,
    alt: 0,
  }],
};

const ex = {
  xmanData,
  positions,
};

export default ex;
