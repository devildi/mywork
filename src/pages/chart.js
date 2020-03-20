import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Fab from '../components/fab'
import Tab from '../components/tab'
import Chart from '../commonComponents/chart'

const useStyles = makeStyles(theme => ({
  root: {
    
  },
}));

export default function FloatingActionButtons({data, rows, width}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Chart data={data} width={width}/>
      <Tab rows={rows}/>
      <Fab add push/>
    </div>
  )
}