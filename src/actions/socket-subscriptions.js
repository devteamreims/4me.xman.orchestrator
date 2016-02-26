import d from 'debug';
const debug = d('4me.socket-subscriptions');
import _ from 'lodash';

export const SOCKET_SUBSCRIPTION_SET_SECTORS = 'SOCKET_SUBSCRIPTION_SET_SECTORS';
export const SOCKET_SUBSCRIPTION_SET_VERTICAL_FILTER = 'SOCKET_SUBSCRIPTION_SET_VERTICAL_FILTER';

export function socketSetSectors(socketId, sectors) {
  return {
    type: SOCKET_SUBSCRIPTION_SET_SECTORS,
    socketId: socketId,
    sectors: sectors
  };
}

export function socketSetVerticalFilter(socketId, verticalFilter) {
  return {
    type: SOCKET_SUBSCRIPTION_SET_VERTICAL_FILTER,
    socketId: socketId,
    verticalFilter: !!verticalFilter
  };
}