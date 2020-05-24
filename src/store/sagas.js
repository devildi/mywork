import axios from 'axios'
import { push } from 'connected-react-router'
import { all, put, takeEvery } from 'redux-saga/effects'
import {
  setUser,
  setWorker,
  setArrangeDataArray,
  setPage,
  setChartData,
  setTableData,
  setAll,
  setLoading,
  setFenye,
  setLeft,
  setRight,

  SET_LIST_SAGA,
  GET_ARRANGEDATA_SAGA,
  GET_USER_SAGA,
  LOGIN_SAGA,
  REGISTER_SAGA,
  LOGOUT_SAGA,
  SUBMIT_SAGA,
  COUNT_SAGA,
  PHOTOS_SAGA
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
  width,
  pic,
  getImg
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
  try{
    const data = yield axios.post('/api/users/login',{...action.payload})
      if(data.data){
        yield put(setUser(data.data.name))
        saveData(USER, data.data.name, expire)
        saveData(TOKEN, data.data.token, expire)
        yield put(push('/'))
      } else {
        alert('查无此人！')
      }
  }catch(e){
    alert(e)
  }
  
}

function* registerSaga(action){
  try{
    const data = yield axios.post('/api/users',{...action.payload})
    if(data.data && typeof data.data === 'string'){
      alert('用户已存在，请直接登录！')
    } else if(data.data && typeof data.data === 'object'){
      alert('注册成功！！')
    } else {
      alert('系统出错，稍后再试！')
    }
  }
  catch(e){
    alert(e)
  }
}

function* logoutSaga(){
  yield axios.post('/api/users/logout')
  yield put(setUser(null))
  deleteData(USER)
  deleteData(TOKEN)
  yield put(setPage(0))
}

function* submitSaga(action){
  const work = yield axios.post('/api/work/submit',{...action.payload},{
    headers: {'Authorization': 'Bearer ' +readData(TOKEN).data}
  })
  if(work.data){
    yield put(push('/'))
  }
}

function* countSage(action){
  yield put(setLoading(true))
  const work = yield axios.get('/api/work/count',{params: {
    page: action.payload
  }})
  //console.log(work.data.output)
  yield put(setChartData(work.data.output))
  yield put(setTableData(work.data.arrWork))
  yield put(setAll(work.data.total))
  yield put(setLoading(false))
  let page = action.payload + 1
  yield put(setFenye(page))
}

function* photosSage(action){
  console.log(action.payload)
  
  let a = []
  let prevLeft = 0;
  let prevRight = 0;
  let right = []
  let left = []

  for (let i = 0 ; i < pic.length ; i++){
    let b = yield getImg(pic[i], width)
    a.push(b)
    if(prevLeft >= prevRight){
      right.push(a[i])
      prevRight = prevRight + a[i].height
    } else {
      left.push(a[i])
      prevLeft = prevLeft + a[i].height
    }
  }

  yield put(setLeft(left))
  yield put(setRight(right))
}

export default function* mySaga (){
	yield all(
    [
      takeEvery(SET_LIST_SAGA, check),
      takeEvery(GET_ARRANGEDATA_SAGA, getArrangeData),
      takeEvery(GET_USER_SAGA, getUserData),
      takeEvery(LOGIN_SAGA, loginSaga),
      takeEvery(REGISTER_SAGA, registerSaga),
      takeEvery(LOGOUT_SAGA, logoutSaga),
      takeEvery(SUBMIT_SAGA, submitSaga),
      takeEvery(COUNT_SAGA, countSage),
      takeEvery(PHOTOS_SAGA, photosSage)
    ]
  )
}