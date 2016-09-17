import moment from 'moment';

const date = new Date();
const xmanFlights = {
  messageTime: date.toJSON(),
  total: 3,
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
    {
      ifplId: "AA56718596",
      destination: "EGLL",
      arcid: "BAW43LQ",
      cop: "ABNUR",
      delay: 326,
      advisory: {
        targetTime: "2016-09-17T07:58:21Z",
        estimatedTime: "2016-09-17T07:58:21Z",
        delay: 0,
        smoothedDelay: 0
      }
    },
    {
      ifplId: "AA56723571",
      destination: "EGLL",
      arcid: "BAW551",
      cop: "ABNUR",
      delay: 464,
      advisory: {
        targetTime: "2016-09-17T07:57:49Z",
        estimatedTime: "2016-09-17T07:57:05Z",
        delay: 44,
        smoothedDelay: 85
      }
    }
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

const targetTime = moment().add(1, 'hours');
const estimatedTime = moment().add(1, 'hours').subtract(5, 'minutes');


const defaultFlight = {
  ifplId: "AA56721254",
  destination: "EGLL",
  arcid: "AMC100A",
  cop: "ABNUR",
  delay: 298,
  advisory: {
    targetTime: targetTime.toJSON(),
    estimatedTime: estimatedTime.toJSON(),
    delay: 0,
    smoothedDelay: 0
  }
};

export function getXmanFlight(overrides) {
  return Object.assign({}, defaultFlight, overrides);
}

export default xmanFlights;
