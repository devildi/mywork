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
  setTrip,
  setItem,

  SET_LIST_SAGA,
  GET_ARRANGEDATA_SAGA,
  GET_USER_SAGA,
  LOGIN_SAGA,
  REGISTER_SAGA,
  LOGOUT_SAGA,
  SUBMIT_SAGA,
  COUNT_SAGA,
  PHOTOS_SAGA,
  NEWTRIP_SAGA,
  NEWITEM_SAGA,
  SAVETRIP_SAGA
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
  getImg,
  Trip
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
  //console.log(action.payload)
  
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

function* newTripSage (action) {
  if(typeof action.payload === 'object'){
    console.log(action.payload)
    const {tripName, designer, uid, domestic, city, country, tags, cover} = action.payload
    try{
      const trip = yield axios.get('/api/trip/get',{params: {
        uid: uid
      }})
      if(trip.data){
        alert('该行程编号对应的行程已存在！')
        yield put(setTrip(trip.data))
        yield put(push('/edit'))
      } else {
        //let obj = new Daytrip()
        let newTrip = new Trip(uid, tripName, designer, domestic, city, country, tags, cover ,[[]])
        console.log(newTrip)
        yield put(setTrip(newTrip))
        yield put(push('/edit'))
      }
    }catch(err){
      alert(err)
    }
  } else {
    try{
      const trip = yield axios.get('/api/trip/get',{params: {
        uid: action.payload
      }})
      if(trip.data){
        yield put(setTrip(trip.data))
        yield put(push('/edit'))
      } else {
        alert('无对应的行程！')
      }
    }catch(err){
      alert(err)
    }
  }
}

function* saveTripSage (action) {
  try{
    const trip = yield axios.post('/api/trip/new',{...action.payload})
    if(trip.data){
      alert('保存成功！')
      yield put(push('/editinit'))
    }
  }catch(err){
    alert(err)
  }
}

function* newItemSage (action){
  try{
    const item = yield axios.post('/api/trip/newItem',{...action.payload})
    if(item.data){
      alert('添加成功！')
      yield put(setItem(''))
    } else{
      alert('不可添加重复的文章！！')
    }
  }catch(err){
    alert(err)
  }
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
      takeEvery(PHOTOS_SAGA, photosSage),
      takeEvery(NEWTRIP_SAGA, newTripSage),
      takeEvery(NEWITEM_SAGA, newItemSage),
      takeEvery(SAVETRIP_SAGA, saveTripSage),
    ]
  )
}