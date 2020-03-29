import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import LazyLoad from 'react-lazyload';
import CircularProgress from '@material-ui/core/CircularProgress'

import Bar from '../components/appbar'

import {
  photosSaga,
} from '../store/action'

const useStyles = makeStyles(theme => ({
	root:{
		width: '100%',
	},
	container: {
		paddingTop: theme.spacing(7),
	},
	block: {
		overFlow: 'hidden',
		padding: 1
	},
	circular:{
		width: '100%',
		position: 'absolute',
		bottom: 0,
		top:0,
		display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: 'center',
	}
}));

function Photos({left, right, dispatch}) {

	const classes = useStyles();
	
	useEffect(()=>{
		dispatch(photosSaga(1))
	}, [dispatch])

	return (
		<div className={classes.root}>
		<Bar title={'照片'} />
		<div className={classes.container}>
			<Grid container >
			{
				left.length > 0 && right.length > 0
			?<React.Fragment>
				<Grid item xs={6} className={classes.block}>
				{
					left.map((item, index) => (
						<LazyLoad key={index} height={item.height}>
							<img alt='' 
								src={item.src} 
								width={'100%'} 
								height={item.height}
								onClick={()=>{console.log(item)}}
							/>
						</LazyLoad>
					))
				}
				</Grid>
				<Grid item xs={6} className={classes.block}>
				{
					right.map((item, index) => (
						<LazyLoad key={index} height={item.height}>
							<img alt='' 
								src={item.src} 
								width={'100%'} 
								height={item.height}
								onClick={()=>{console.log(item)}} 
							/>
						</LazyLoad>
					))
				}
				</Grid>
			</React.Fragment>
			: <div className={classes.circular}>
					<CircularProgress />
				</div>
			}		
			</Grid>
		</div>
		</div>
	);
}

export default connect(
  function mapStateToProps(state) {
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch };
  }
)(Photos);