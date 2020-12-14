import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/ArrowBackIos';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
  },
}));

export default function Bar ({title, history}) {
	const classes = useStyles();
	const back = () => {
		history.push('/')
	}
	return (
	<AppBar>
		<Toolbar>
			{
				history 
				? <IconButton edge="start" color="inherit" onClick={back}>
					<MenuIcon />
				</IconButton> 
				: null
			}
			<div className={classes.root}>
				<p>{title}</p>
			</div>
		</Toolbar>
    </AppBar>
	)
}