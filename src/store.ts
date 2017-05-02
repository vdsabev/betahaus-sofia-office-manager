import { createStore, combineReducers, applyMiddleware } from 'redux';

import { Actions } from './actions';
import { logger } from './logger';
import { Room } from './room';
import { Supply } from './supply';

export type State = {
  rooms: Room[]
  selectedRoom: Room
  selectedRoomSupplies: Supply[]
};

const reducers = combineReducers<State>({ rooms, selectedRoom, selectedRoomSupplies });
export const store = createStore(
  reducers,
  process.env.NODE_ENV === 'production' ? undefined : applyMiddleware(logger)
);

export type Action = {
  [key: string]: any;
  type?: Actions
};

export function rooms(state: Room[] = [], action: Action = {}): Room[] {
  switch (action.type) {
  case Actions.ADD_ROOM:
    return [...state, action.room];
  default:
    return state;
  }
}

export function selectedRoom(state: Room = null, action: Action = {}): Room {
  switch (action.type) {
  case Actions.SELECT_ROOM:
    return action.room;
  default:
    return state;
  }
}

export function selectedRoomSupplies(state: Supply[] = [], action: Action = {}): Supply[] {
  switch (action.type) {
  case Actions.SELECT_ROOM:
    return [];
  case Actions.ADD_SUPPLY:
    return [...state, action.supply];
  case Actions.SUPPLY_REQUESTED:
    const requestedSupply = action.supply;
    return state.map((supply) => (
      supply !== requestedSupply ? supply : new Supply(supply, { requested: action.requested })
    ));
  default:
    return state;
  }
}
