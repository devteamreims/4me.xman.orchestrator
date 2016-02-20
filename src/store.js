import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import d from 'debug';
const debug = d('4me.redux');

import {attachSocketIo} from './actions/socket';

import reducers from './reducers';

export default function makeStore(socketIo) {
  debug('Creating store');
  
  const logger = createLogger({
    logger: {
      log: debug,
    },
    colors: {}
  });

  const store = createStore(reducers, applyMiddleware(thunk, logger));
  

  store.dispatch(attachSocketIo(socketIo));

  return store;
}