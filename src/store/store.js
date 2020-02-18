import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'

import reducer from './reducer'
import {workers, format} from '../tools'
import mySaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    combineReducers(reducer),
    {
      user: null,
      whichPage: 1,
      workers: format(workers),
      list: [],
    },
    composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(mySaga)

export default store