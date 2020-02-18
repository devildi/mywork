import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Sign from '../commonComponents/signin'
import BottomNavigation from '../components/bottomNavigation'
import Bar from '../components/appbar'

import Chart from './chart'
import Arrange from './arrange'
import Photos from './photos'
import Profile from './profile'

import {
  setPage,
} from '../store/action'

import { h0} from '../tools';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(8, 0, 5, 0),
  },
}));

function Index(props) {
  const A = ['数据', '排班', '照片墙', '用户']
  const {
    user,
    whichPage,
    history,
    dispatch
  } = props

	const classes = useStyles();

  const onSelect = (p) => {dispatch(setPage(p))}

  const onSelect1 = (day) => {
    const now = h0();
    if(day < now){
      return
    }
    history.push({pathname: '/submitArrange',payload: { date: day }});
  }

  return (
		<div className={classes.root}>

    {
      whichPage === 0
      &&<React.Fragment>
        <Bar title={A[whichPage]} />
        <Chart/>
      </React.Fragment>
    }
    {
      whichPage === 1
      &&<React.Fragment>
        <Bar title={A[whichPage]} />
        <Arrange history={history} onSelect={onSelect1}/>
      </React.Fragment>
    }
    {
      whichPage === 2
      &&<React.Fragment>
        <Bar title={A[whichPage]} />
        <Photos/>
      </React.Fragment>
    }
    {
      whichPage === 3
      &&<React.Fragment>
        <Bar title={A[whichPage]} />
        <Profile/>
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
