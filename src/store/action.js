export const SET_USER = 'SET_USER';
export const SET_PAGE = 'SET_PAGE';
export const SET_WORKERS = 'SET_WORKERS';
export const SET_LIST = 'SET_LIST';

export const SET_LIST_SAGA = 'SET_LIST_SAGA';

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

export function setListSaga(list) {
  return {
    type: SET_LIST_SAGA,
    payload: list,
  };
}