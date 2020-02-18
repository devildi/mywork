import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Fab from '../components/fab'
import Paper from '../components/paper'
import Tab from '../components/tab'

const useStyles = makeStyles(theme => ({
  root: {
    
  },
}));

export default function FloatingActionButtons() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper>
      </Paper>
      <Paper>
      </Paper>
      <Tab />
      <Fab add push/>
    </div>
  )
}