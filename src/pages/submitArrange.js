import React, {useRef} from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';

import Fab from '../components/fab'

import {
  setWorker,
  setListSaga,
} from '../store/action'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2,2,0,2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: 'center',
  },
  div: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    border:'1px solid #f0f0f0',
    borderRadius: theme.spacing(1),
  },
  submit: {
    width: '100%',
    margin: theme.spacing(1),
    height: theme.spacing(7)
  },
  chip: {
    margin: theme.spacing(0.5, 0.5, 0.5 ,0),
  }
}));

function SubmitArrange(props) {
  const classes = useStyles();
  const { 
    workers,
    dispatch,
    list,
    location,
    history
   } = props

  let day = location.payload.date

  const onSelect = (e) => {
    dispatch(setWorker(e.target.innerHTML))
    dispatch(setListSaga(e.target.innerHTML))
  }

  const submitArrange = () => {
    console.log(list)
  }

  return (
    <div className={classes.root}>
      {
        workers.map((row, index) => (
          <div className={classes.div} key={index}>
            <Typography variant="h6" component="h2">
              {row[0].role}
            </Typography>
            <div>
              {
                row.map(item => (
                  <Chip 
                    color="primary"
                    key={item.name}
                    label={item.name} 
                    variant={item.isChoosed ? "default" : 'outlined'}
                    className={classes.chip}
                    clickable
                    onClick={onSelect}
                  />
                ))
              }
            </div>
          </div>
        ))
      }
      <Button 
        variant="contained" 
        color="primary" 
        className={classes.submit}
        startIcon={<SubdirectoryArrowRightIcon />}
        onClick={submitArrange}
        disabled={list.length > 0 ? false : true}
      >
        {`完成${new Date(day).getMonth() + 1}月${new Date(day).getDate()}日的排班：`}
      </Button>
      <Fab bottom/>
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
)(SubmitArrange);