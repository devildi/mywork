import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import { connect } from 'react-redux';
import Fab from '../components/fab'
import DateC from '../components/date'

import { h0 } from '../tools'

import{
  submitSaga
} from '../store/action'

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

function BasicTextFields({dispatch}) {
  const classes = useStyles();

  const [shootnums, setShootnums] = useState(0)
  const [program, setProgram] = useState('')
  const [des, setDes] = useState('')
  const [date, setDate] = useState(h0())

  const onSubmit = () => {
    if(!shootnums || !program){
      return alert('有未填项！')
    }
    const obj = {
      shootnums: shootnums.trim(),
      program: program.trim(),
      des: des ? des.trim() : des,
      date: date
    }
    dispatch(submitSaga(obj))
  }

  const getDate = (v) => {
    setDate(v)
  }

  return (
    <div className={classes.root}>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField 
          className={classes.submit} 
          id="number" 
          label="镜头数" 
          variant="outlined"
          onChange={(e) => {setShootnums(e.target.value)}}
        />
        <TextField 
          className={classes.submit} 
          id="name" 
          label="节目名字" 
          variant="outlined"
          onChange={(e) => {setProgram(e.target.value)}}
        />
        <TextField 
          className={classes.submit} 
          id="sth" 
          label="备注" 
          variant="outlined"
          onChange={(e) => {setDes(e.target.value)}}
        />
        <div className={classes.submit}>
          <DateC getDate={getDate}/>
        </div>
        <Button 
          variant="contained" 
          color="primary" 
          className={classes.submit}
          startIcon={<SubdirectoryArrowRightIcon />}
          onClick={onSubmit}
        >
          提交
        </Button>
      </form>
      <Fab />
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
)(BasicTextFields);