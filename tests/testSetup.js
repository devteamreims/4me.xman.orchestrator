// Mock bunyan here
// We add a specific stream to opsLog
// We also put this stream in globals to ease access in tests
import {opsLog} from '../src/logger';
import bunyan from 'bunyan';
const ringBuffer = new bunyan.RingBuffer({limit: 20});
global.LOG_STREAM = ringBuffer;

opsLog.addStream({
  stream: ringBuffer,
  type: 'raw',
  level: 'trace',
});

global.EGLL_PARSER_URL = "http://egll-parser";
global.POSITIONS_URL = "http://flight-positions";

beforeEach(() => {
  process.env.EGLL_PARSER_URL = global.EGLL_PARSER_URL;
  process.env.POSITIONS_URL = global.POSITIONS_URL;
  process.env.FOURME_ENV = 'LFEE';
});

afterEach(() => {
  delete process.env.EGLL_PARSER_URL;
  delete process.env.POSITIONS_URL;
  delete process.env.FOURME_ENV;
});

// Mock socket.io here
// Socket.io doesn't work in Jest environment
// See here :
// * https://github.com/socketio/socket.io/issues/2381
//import mockIo from './mocks/socket.io';
//jest.mock('socket.io', () => mockIo());
// UPDATE : Socket.io works fine if 'jsdom' environment is set by Jest
