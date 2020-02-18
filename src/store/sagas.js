import { all, take, call, put, takeEvery, takeLatest, fork } from 'redux-saga/effects'
import {
  SET_LIST_SAGA,

  setList
} from './action'

import { workers } from '../tools'

function * check(action){
  const { type, payload } = action;

  let index = workers.findIndex(i => i.name === payload)
  if (index > -1){
    yield put(setList(payload))
  } else {
    return 
  }
}


export default function* mySaga (){
	yield takeLatest(SET_LIST_SAGA, check);
}