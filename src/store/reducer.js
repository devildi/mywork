import {
	SET_USER,
	SET_PAGE,
  SET_WORKERS,
  SET_LIST,
} from './action'

import { workers } from '../tools'

export default {
	user(state = null, action) {
    const { type, payload } = action;
    switch (type) {
        case SET_USER:
            return payload;
        default:
    }
    return state;
  },
  whichPage(state = 1, action) {
    const { type, payload } = action;
    switch (type) {
        case SET_PAGE:
            return payload;
        default:
    }

    return state;
  },
  workers(state = [], action) {
    const { type, payload } = action;
    switch (type) {
        case SET_WORKERS:
            let arr = [...state] 
            arr.map((i) =>{
              i.map((item, index) => {
                if(item.name === payload){
                  item.isChoosed = !item.isChoosed
                }
              })
            })
            return arr;
        default:
    }

    return state;
  },
  list(state = [], action) {
    const { type, payload } = action;
    switch (type) {
        case SET_LIST:
            let newList = [...state]
            if(newList.length > 0){
              let index = newList.findIndex(i => i === payload)
              if(index > -1){
                newList.splice(index, 1)
              } else {
                newList.push(payload)
              }
            } else {
              newList.push(payload)
            }
            //console.log(newList)
            return newList;
        default:
    }

    return state;
  },
}