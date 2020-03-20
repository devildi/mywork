import React, {useRef, useState, useEffect} from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import LazyLoad from 'react-lazyload';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	img: {
		width: '100%',
		marginBottom: 2,
	},
	block: {
		overFlow: 'hidden',
		padding: 1
	}
}));

function Photos() {
	const classes = useStyles();

	const [left ] = useState([])
	const [right] = useState([])

	let a = []
	for( let i = 0; i < 20; i++){
		a.push(Math.ceil(Math.random()*300))
	}

	let prevLeft = useRef(0);
	let prevRight = useRef(0);

	useEffect(()=>{
		
	}, [])

	for (let i = 0 ; i < a.length ; i++){
		if(prevLeft.current >= prevRight.current){
			right.push(a[i])
			prevRight.current = prevRight.current + a[i]
		} else {
			left.push(a[i])
			prevLeft.current = prevLeft.current + a[i]
		}
	}

	return (
		<div className={classes.root} >
			<LazyLoad>
				<Grid container >
					<Grid item xs={6} className={classes.block}>
					{
						left.length > 0 && left.map((item, index) => (
							<Skeleton className={classes.img} variant="rect" key={index} width={'100%'} height={item} />
						))
					}
					</Grid>
					<Grid item xs={6} className={classes.block}>
						{
							right.length > 0 && right.map((item, index) => (
								<Skeleton className={classes.img} variant="rect" key={index} width={'100%'} height={item} />
							))
						}
					</Grid>
				</Grid>
			</LazyLoad>
		</div>
	);
}

export default Photos;