import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';

import Fab from '../components/fab'
import DateC from '../components/date'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2,2,0,2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: 'center',
  },
  form: {
    margin: theme.spacing(1),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: 'center',
  },
  submit: {
    width: '100%',
    margin: theme.spacing(1),
    height: theme.spacing(7)
  }
}));

export default function BasicTextFields() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField 
          className={classes.submit} 
          id="number" 
          label="镜头数" 
          variant="outlined" 
        />
        <TextField 
          className={classes.submit} 
          id="name" 
          label="节目名字" 
          variant="outlined" 
        />
        <TextField 
          className={classes.submit} 
          id="sth" 
          label="备注" 
          variant="outlined" 
        />
        <div className={classes.submit}>
          <DateC />
        </div>
        <Button 
          variant="contained" 
          color="primary" 
          className={classes.submit}
          startIcon={<SubdirectoryArrowRightIcon />}
        >
          提交
        </Button>
      </form>
      <Fab />
    </div>
  );
}