import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ArrowBack from '@material-ui/icons/ArrowBack';

import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      position: 'fixed',
      right: theme.spacing(1),
      bottom: theme.spacing(8),
    },
  },
}));

export default function FloatingActionButtons({add, push, clear, arrange}) {
  const classes = useStyles();
  let history = useHistory();

  const click = () => {
    history.push('./submit')
  }

  const back = () => {
    history.goBack()
    if(arrange) { clear() }
  }

  return (
    <div className={classes.root}>
      <Fab 
        color="primary" 
        aria-label="add"
        onClick={push ? click : back}
      >
        {
          add 
          ? <AddIcon /> 
          : <ArrowBack />
        }
      </Fab>
    </div>
  );
}