import React, {useState, useEffect, useRef} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import io from 'socket.io-client'

import { connect } from 'react-redux'

import BottomNavigation from '../components/bottomNavigation'
import Bar from '../components/appbar'

import Chart from './chart'
import Arrange from './arrange'
import Profile from './profile'
import '../css/index.css'
import {
  setPage,
  setWorker,
  setArrangeDataDelete,
  getArrangeDataSaga,
  logoutSaga,
  countSaga,
  //setNextstickerusersincreaesd
} from '../store/action'

import { 
  h0, 
  falmatData,
  getScrollTop,
  getClientHeight,
  getScrollHeight,
} from '../tools';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(8, 0, 0, 0),
    height: '100%'
  },
}));

function getlength(arr){
  let length = 0
  if(arr){
    for(let i = 0; i < arr.length; i++){
      length = length + arr[i].length
    }
    return length
  }else return length
}
//程序入口：
function Index(props) {
  const A = ['用户', '排班', '办公数据']
  const {
    user,
    whichPage,
    fenye,
    history,
    arrangeData,
    chartData,
    tableData,
    all,
    loading,
    nextstickerUsersIncreased,
    dispatch
  } = props

	const classes = useStyles()
  

  const tableDataRef = useRef();
  const allRef = useRef();
  const fenyeRef = useRef();

  const [width, setWidth] = useState(document.body.clientWidth)

  useEffect(() => {
    //const socket = io("ws://localhost:3000");
    //socket.emit('send', {text:'6666'})
  }, [])

  useEffect(() => {
    tableDataRef.current = tableData
    allRef.current = all
    fenyeRef.current = fenye
  });

  useEffect(()=>{
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', () => {})
    }
  }, [])

  const resize = () => {
    setWidth(document.body.clientWidth)
  }

  useEffect(()=>{
    window.addEventListener('scroll', scroll)
    return () => {
      window.removeEventListener('scroll', () => {})
    }
  })

  const scroll = () => {
    if((getScrollHeight() - getScrollTop() - getClientHeight()) <= 20&& !loading){
      if(getlength(tableDataRef.current) < allRef.current){
        dispatch(countSaga(fenyeRef.current))
      } else {
        return 
      }
    }
  }
  //SSE===========================
  // useEffect(() => {
  //   const socket = io()
  //   console.log('完成Socket连接！')
  //   socket.on('addClient', msg => {
  //     let num = nextstickerUsersIncreased
  //     num++
  //     dispatch(setNextstickerusersincreaesd(num))
  //   })
  // }, [dispatch, nextstickerUsersIncreased])

  useEffect(() => {
    dispatch(countSaga(1))
    dispatch(getArrangeDataSaga())
  }, [dispatch])

  const onSelect = (p) => {dispatch(setPage(p))}

  const onSelect1 = (day) => {
    const now = h0();
    if(day < now){
      return
    }

    if(arrangeData && arrangeData.length > 0){

      let index = arrangeData.findIndex(i => i.date === day)
      if(index > -1){
        let array = arrangeData[index].list
        for(let index = 0; index < array.length; index++){
          dispatch(setWorker(array[index]))
        }
      }
    }

    history.push({pathname: '/submitArrange',payload: { date: day }});
  }

  const toArrange = (i) => {
    let array = arrangeData[i].list
    for(let index = 0; index < array.length; index++){
      dispatch(setWorker(array[index]))
    }
    history.push({pathname: '/submitArrange',payload: { date: arrangeData[i].date }});
  }

  const clearDay = (i) => {
    dispatch(setArrangeDataDelete(i))
  }

  const logout = () => {
    dispatch(logoutSaga())
  }

  return (
		<div className={classes.root}>
    {
      whichPage === 0
      &&<React.Fragment>
        <Bar title={A[whichPage]} />
        <Profile 
          user={user} 
          logout={logout}  
          history={history}
          flag={nextstickerUsersIncreased > 0} 
        />
      </React.Fragment>
    }
    {
      whichPage === 1
      &&<React.Fragment>
        <Bar title={A[whichPage]} />
        <Arrange 
          history={history} 
          onSelect={onSelect1} 
          arrangeData={arrangeData}
          toArrange={toArrange}
          clearDay={clearDay}
        />
      </React.Fragment>
    }
    {
      whichPage === 2
      &&<React.Fragment>
        <Bar title={A[whichPage]} />
        <Chart data={falmatData(chartData)} rows={tableData} width={width}/>
      </React.Fragment>
    }
    	<BottomNavigation 
        onSelect={onSelect} 
        whichPage={whichPage}
        nextstickerUsersIncreased={nextstickerUsersIncreased}
      />
    </div>
  )
}

export default connect(
  function mapStateToProps(state) {
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch };
  }
)(Index);