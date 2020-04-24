import React, {useState, useEffect, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';

import BottomNavigation from '../components/bottomNavigation'
import Bar from '../components/appbar'

import Chart from './chart'
import Arrange from './arrange'
import Profile from './profile'

import {
  setPage,
  setWorker,
  setArrangeDataDelete,
  getArrangeDataSaga,
  logoutSaga,
  countSaga,
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
    padding: theme.spacing(8, 0, 5, 0),
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

function Index(props) {
  const A = ['数据', '排班', '用户']
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
    dispatch
  } = props

	const classes = useStyles();

  const tableDataRef = useRef();
  const allRef = useRef();
  const fenyeRef = useRef();

  const [width, setWidth] = useState(document.body.clientWidth)

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
        <Chart data={falmatData(chartData)} rows={tableData} width={width}/>
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
        <Profile user={user} logout={logout}  history={history}/>
      </React.Fragment>
    }
    	<BottomNavigation onSelect={onSelect} whichPage={whichPage}/>
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
