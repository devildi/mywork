export const SET_ALL = 'SET_ALL';
export const SET_LOADING = 'SET_LOADING';
export const SET_FENYE = 'SET_FENYE'
export const SET_USER = 'SET_USER';
export const SET_PAGE = 'SET_PAGE';
export const SET_WORKERS = 'SET_WORKERS';
export const SET_LIST = 'SET_LIST';
export const SET_ARRANGEDATA = 'SET_ARRANGEDATA';
export const SET_ARRANGEDATA_ARRAY = 'SET_ARRANGEDATA_ARRAY';
export const SET_ARRANGEDATA_DELETE = 'SET_ARRANGEDATA_DELETE';
export const SET_CHART_DATA = 'SET_CHART_DATA'
export const SET_TABLE_DATA = 'SET_TABLE_DATA'
export const SET_LEFT = 'SET_LEFT';
export const SET_RIGHT = 'SET_RIGHT';
export const SET_TRIP = 'SET_TRIP';

export const SET_LIST_SAGA = 'SET_LIST_SAGA';
export const GET_ARRANGEDATA_SAGA = 'GET_ARRANGEDATA_SAGA';
export const GET_USER_SAGA = 'GET_USE_SAGA';
export const LOGIN_SAGA = 'LOGIN_SAGA';
export const REGISTER_SAGA = 'REGISTER_SAGA_SAGA';
export const LOGOUT_SAGA = 'LOGOUT_SAGA';
export const SUBMIT_SAGA = 'SUBMIT_SAGA';
export const COUNT_SAGA = 'COUNT_SAGA';
export const PHOTOS_SAGA = 'PHOTOS_SAGA';
export const NEWTRIP_SAGA = 'NEWTRIP_SAGA';
export const SAVETRIP_SAGA = 'SAVETRIP_SAGA';

export function setTrip(data) {
  return {
    type: SET_TRIP,
    payload: data,
  };
}

export function setAll(all) {
  return {
    type: SET_ALL,
    payload: all,
  };
}

export function setLoading(loading) {
  return {
    type: SET_LOADING,
    payload: loading,
  };
}

export function setChartData(chartData) {
  return {
    type: SET_CHART_DATA,
    payload: chartData,
  };
}

export function setTableData(tableData) {
  return {
    type: SET_TABLE_DATA,
    payload: tableData,
  };
}

export function setFenye(page) {
  return {
    type: SET_FENYE,
    payload: page,
  };
}

export function setUser(user) {
  return {
    type: SET_USER,
    payload: user,
  };
}

export function setPage(whichPage) {
  return {
    type: SET_PAGE,
    payload: whichPage,
  };
}

export function setWorker(whichIsChoosed) {
  return {
    type: SET_WORKERS,
    payload: whichIsChoosed,
  };
}

export function setList(list) {
  return {
    type: SET_LIST,
    payload: list,
  };
}

export function setLeft(list) {
  return {
    type: SET_LEFT,
    payload: list,
  };
}

export function setRight(list) {
  return {
    type: SET_RIGHT,
    payload: list,
  };
}

export function setArrangeData(arrangeData){
  return {
    type: SET_ARRANGEDATA,
    payload: arrangeData,
  };
}

export function setArrangeDataArray(arrangeDataArray){
  return {
    type: SET_ARRANGEDATA_ARRAY,
    payload: arrangeDataArray,
  };
}

export function setArrangeDataDelete(index){
  return {
    type: SET_ARRANGEDATA_DELETE,
    payload: index,
  };
}

export function setListSaga(list) {
  return {
    type: SET_LIST_SAGA,
    payload: list,
  };
}

export function getArrangeDataSaga() {
  return {
    type: GET_ARRANGEDATA_SAGA
  };
}

export function getUserDataSaga() {
  return {
    type: GET_USER_SAGA
  };
}

export function loginSaga(payload) {
  return {
    type: LOGIN_SAGA,
    payload: payload,
  };
}

export function registerSaga(payload) {
  return {
    type: REGISTER_SAGA,
    payload: payload,
  };
}

export function logoutSaga() {
  return {
    type: LOGOUT_SAGA
  };
}

export function submitSaga(payload) {
  return {
    type: SUBMIT_SAGA,
    payload: payload,
  };
}

export function countSaga(payload) {
  return {
    type: COUNT_SAGA,
    payload: payload,
  };
}

export function photosSaga(payload) {
  return {
    type: PHOTOS_SAGA,
    payload: payload,
  };
}

export function newTripSaga(payload) {
  return {
    type: NEWTRIP_SAGA,
    payload: payload,
  };
}

export function saveTripSaga(payload) {
  return {
    type: SAVETRIP_SAGA,
    payload: payload,
  };
}