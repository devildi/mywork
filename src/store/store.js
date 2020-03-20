import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'

import reducer from './reducer'
import {workers, format, whichPage} from '../tools'
import mySaga from './sagas'

export const history = createBrowserHistory()

const routeMiddleware = routerMiddleware(history)
const sagaMiddleware = createSagaMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    combineReducers({
    	...reducer,
    	router: connectRouter(history),
    }),
    { 
      fenye: 1,
      all: 0,
      loading: false,
      user: null,
      chartData: null,
      tableData: null,
      whichPage: whichPage,
      workers: format(workers),
      list: [],
      arrangeData: [],
    },
    composeEnhancers(applyMiddleware(routeMiddleware, sagaMiddleware))
);

sagaMiddleware.run(mySaga)

export default store