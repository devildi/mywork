import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
      height: theme.spacing(16),
    },
  },
}));

export default function SimplePaper(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper elevation={1}>
        {props.children}
      </Paper>
    </div>
  );
}