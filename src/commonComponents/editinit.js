import React, {useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Bar from '../components/appbar';
import InputLabel from '@material-ui/core/InputLabel';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import{
  newTripSaga
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
    margin: theme.spacing(7,1,1,1),
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
  },
  textField: {
    width: '100%',
  },
  input: {
  	width: '100%',
  }
}));

const handleMouseDownPassword = (event) => {
  event.preventDefault();
};


function Editinit({dispatch, history}){
	const classes = useStyles()

  const [uid1, setUid1] = useState('')

	const [tripName, setTripName] = useState('')
  const [designer, setDesigner] = useState('')
  const [uid, setUid] = useState('')
  const [domestic, setDomestic] = useState(1)
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [tags, setTags] = useState('')

  const updateTrip = () => {
  	if(!uid1){
      return alert('有未填项！')
    }
    dispatch(newTripSaga(uid1))
  }

  const newTrip = () => {
		if(!tripName || !designer|| !uid || !domestic || !city || !country || !tags){
      return alert('有未填项！')
    }
    const obj = {
      tripName: tripName.trim(),
      designer: designer.trim(),
      uid: uid,
      city: city,
      country: country,
      tags: tags,
      domestic: parseInt(domestic)
    }
    dispatch(newTripSaga(obj))
	}

	return (
		<div className={classes.root}>
			<Bar title={'地图数据编辑'} history={history}/>
			<FormControl className={clsx(classes.form, classes.textField)} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">输入行程编号</InputLabel>
        <Input
        	className={classes.input}
          type='text'
          //value={values.password}
          onChange={(e) => {setUid1(e.target.value)}}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="visibility"
                onClick={updateTrip}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                <ArrowForwardIcon />
              </IconButton>
            </InputAdornment>
          }
        />
    	</FormControl>
    	或者
    	<form className={classes.form} noValidate autoComplete="off">
        <TextField 
          className={classes.submit} 
          id="number" 
          label="行程名字" 
          variant="outlined"
          onChange={(e) => {setTripName(e.target.value)}}
        />
        <TextField 
          className={classes.submit} 
          id="name" 
          label="设计者" 
          variant="outlined"
          onChange={(e) => {setDesigner(e.target.value)}}
        />
        <TextField 
          className={classes.submit} 
          id="domestic" 
          label="国内还是国外（1/0）" 
          variant="outlined"
          onChange={(e) => {setDomestic(e.target.value)}}
        />
        <TextField 
          className={classes.submit} 
          id="sth" 
          label="行程编号" 
          variant="outlined"
          onChange={(e) => {setUid(e.target.value)}}
        />
        <TextField 
          className={classes.submit} 
          id="city" 
          label="城市" 
          variant="outlined"
          onChange={(e) => {setCity(e.target.value)}}
        />
        <TextField 
          className={classes.submit} 
          id="country" 
          label="国家" 
          variant="outlined"
          onChange={(e) => {setCountry(e.target.value)}}
        />
        <TextField 
          className={classes.submit} 
          id="tags" 
          label="标签（英文 / 分割）" 
          variant="outlined"
          onChange={(e) => {setTags(e.target.value)}}
        />
        <Button 
          variant="contained" 
          color="primary" 
          className={classes.submit}
          onClick={newTrip}
        >
          新建行程
        </Button>
      </form>
		</div>
	)
}

export default connect(
  function mapStateToProps(state) {
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch };
  }
)(Editinit);
