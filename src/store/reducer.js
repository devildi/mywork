import {
  SET_NEXTSTICKERUSERSINCREASED,
  SET_ALL,
  SET_LOADING,
	SET_USER,
  SET_FENYE,
	SET_PAGE,
  SET_WORKERS,
  SET_CHART_DATA,
  SET_TABLE_DATA,
  SET_ARRANGEDATA,
  SET_ARRANGEDATA_ARRAY,
  SET_ARRANGEDATA_DELETE,
  SET_LEFT,
  SET_RIGHT,
  SET_TRIP,
  SET_ITEM,
  SET_PAGEINDEX
} from './action'

import { 
  ATTANGEDATA,
  expire,
  saveData,
  workers, 
  format, 
  whichPage
} from '../tools';

export default {
  chartData(state = null, action) {
    const { type, payload } = action;
    switch (type) {
      case SET_CHART_DATA:
        return payload;
      default:
    }
    return state;
  },
  tableData(state = null, action) {
    const { type, payload } = action;
    switch (type) {
      case SET_TABLE_DATA:
        return payload;
      default:
    }
    return state;
  },
  left(state = [], action) {
    const { type, payload } = action;
    switch (type) {
      case SET_LEFT:
        return payload;
      default:
    }
    return state;
  },
  right(state = [], action) {
    const { type, payload } = action;
    switch (type) {
      case SET_RIGHT:
        return payload;
      default:
    }
    return state;
  },
	user(state = null, action) {
    const { type, payload } = action;
    switch (type) {
      case SET_USER:
        return payload;
      default:
    }
    return state;
  },
  trip(state = null, action) {
    const { type, payload } = action;
    switch (type) {
      case SET_TRIP:
        return payload;
      default:
    }
    return state;
  },
  item(state = '', action) {
    const { type, payload } = action;
    switch (type) {
      case SET_ITEM:
        return payload;
      default:
    }
    return state;
  },
  all(state = 0, action) {
    const { type, payload } = action;
    switch (type) {
      case SET_ALL:
        return payload;
      default:
    }
    return state;
  },
  loading(state = false, action) {
    const { type, payload } = action;
    switch (type) {
      case SET_LOADING:
        return payload;
      default:
    }
    return state;
  },
  whichPage(state = whichPage, action) {
    const { type, payload } = action;
    switch (type) {
      case SET_PAGE:
        return payload;
      default:
    }
    return state;
  },
  fenye(state = 1, action) {
    const { type, payload } = action;
    switch (type) {
      case SET_FENYE:
        return payload;
      default:
    }
    return state;
  },
  nextstickerUsersIncreased(state = 0, action) {
    const { type, payload } = action;
    switch (type) {
      case SET_NEXTSTICKERUSERSINCREASED:
        return payload;
      default:
    }
    return state;
  },
  workers(state = format(workers), action) {
    const { type, payload } = action;
    switch (type) {
      case SET_WORKERS:
        let arr = [...state]
        arr.forEach((i) => {
          i.forEach((item, index) => {
            if(payload && item.name === payload){
              item.isChoosed = !item.isChoosed
            } else if(!payload){
              item.isChoosed = false
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
      case SET_WORKERS:
        if(!payload){
          return []
        }
        let newList1 = [...state]
        if(newList1.length > 0){
          let index = newList1.findIndex(i => i === payload)
          if(index > -1){
            newList1.splice(index, 1)
          } else {
            newList1.push(payload)
          }
        } else {
          newList1.push(payload)
        }
        return newList1;
      default:
    }
    return state;
  },
  arrangeData(state = [], action){
    const { type, payload } = action;
    switch (type) {
      case SET_ARRANGEDATA:
        const { date, list } = payload
        let data = {'date': date, 'list': list}
        let arr = [...state]
        let index = arr.findIndex( i => i.date === date)
        if(index > -1){
          arr.splice(index, 1, data)
        } else {
          arr.push(data)
          arr.sort(function(a, b){return a.date - b.date})
        }
        saveData(ATTANGEDATA, arr, expire)
        return arr;
      case SET_ARRANGEDATA_ARRAY:
        let arr2 = [...payload]
        return arr2;
      case SET_ARRANGEDATA_DELETE:
        let arr1 = [...state]
        arr1.splice(payload, 1)
        saveData(ATTANGEDATA, arr1, expire)
        return arr1;
      default:
    }
    return state;
  },
  pageIndex(state = 1, action){
    const { type, payload } = action;
    switch (type) {
      case SET_PAGEINDEX:
        return payload;
      default:
    }
    return state;
  }
}