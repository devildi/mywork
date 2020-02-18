import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
  },
}));

export default function Bar ({title}) {
	const classes = useStyles();

	return (
		<AppBar>
    	<div className={classes.root}>
      	<p>{title}</p>
      </div>
    </AppBar>
	)
}