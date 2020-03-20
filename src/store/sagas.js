import axios from 'axios'
import { push } from 'connected-react-router'
import { all, put, takeEvery } from 'redux-saga/effects'
import {
  setUser,
  setWorker,
  setArrangeDataArray,
  SET_LIST_SAGA,
  GET_ARRANGEDATA_SAGA,
  GET_USER_SAGA,
  LOGIN_SAGA,
  LOGOUT_SAGA,
  setPage,
  SUBMIT_SAGA,
  COUNT_SAGA,
  setChartData,
  setTableData,
  setAll,
  setLoading,
  setFenye
} from './action'

import { 
  ATTANGEDATA,
  USER,
  TOKEN,
  expire,
  workers, 
  readData,
  deleteData,
  saveData,
} from '../tools'

function* check(action){
  const { payload } = action;
  let index = workers.findIndex(i => i.name === payload)
  if (index > -1){
    yield put(setWorker(payload))
  } else {
    return 
  }
}

function* getArrangeData(){
  let cache = readData(ATTANGEDATA)
  if (cache && Date.now() < cache.expires) {
    yield put(setArrangeDataArray(cache.data))
    return
  } else if(cache){
    deleteData(ATTANGEDATA)
  } else {return}
}

function* getUserData(){
  let cache = readData(USER)
  if (cache && Date.now() < cache.expires) {
    yield put(setUser(cache.data))
    return
  } else if(cache){
    deleteData(USER)
  } else {return}
}

function* loginSaga(action){
  const data = yield axios.post('/users/login',{...action.payload})
  if(data.data){
    yield put(setUser(data.data.name))
    saveData(USER, data.data.name, expire)
    saveData(TOKEN, data.data.token, expire)
  } else {
    alert('查无此人！')
  }
}

function* logoutSaga(){
  yield axios.post('/users/logout')
  yield put(setUser(null))
  deleteData(USER)
  deleteData(TOKEN)
  yield put(setPage(0))
}

function* submitSaga(action){
  const work = yield axios.post('/work/submit',{...action.payload},{
    headers: {'Authorization': 'Bearer ' +readData(TOKEN).data}
  })
  if(work.data){
    yield put(push('/'))
  }
}

function* countSage(action){
  yield put(setLoading(true))
  const work = yield axios.get('/work/count',{params: {
    page: action.payload
  }})
  yield put(setChartData(work.data.output))
  yield put(setTableData(work.data.arrWork))
  yield put(setAll(work.data.total))
  yield put(setLoading(false))
  let page = action.payload + 1
  yield put(setFenye(page))
}

export default function* mySaga (){
	yield all(
    [
      takeEvery(SET_LIST_SAGA, check),
      takeEvery(GET_ARRANGEDATA_SAGA, getArrangeData),
      takeEvery(GET_USER_SAGA, getUserData),
      takeEvery(LOGIN_SAGA, loginSaga),
      takeEvery(LOGOUT_SAGA, logoutSaga),
      takeEvery(SUBMIT_SAGA, submitSaga),
      takeEvery(COUNT_SAGA, countSage)
    ]
  )
}