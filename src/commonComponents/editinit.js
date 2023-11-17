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
import Chip from '@material-ui/core/Chip';
import { connect } from 'react-redux';
import Link from '@material-ui/core/Link';
import{
  newTripSaga
} from '../store/action'
import {
  tagsArray
} from '../tools'

const useStyles = makeStyles(theme => ({
	root: {
    padding: theme.spacing(2,2,0,2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: 'center',
  },
  form: {
    margin: theme.spacing(6,1,1,1),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: 'center',
  },
  form1: {
    //margin: theme.spacing(0,1,1,1),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    //justifyContent: "center",
    //alignItems: 'center',
  },
  chip: {
    display: 'flex',
    flexDirection: 'row',
    margin: theme.spacing(1,0,1,0),
  },
  chipContainer: {
    margin: theme.spacing(0,1,0,0),
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
  const [cover, setCover] = useState('')

  const [array, setArray] = useState([])

  const updateTrip = () => {
  	if(!uid1){
      return alert('有未填项！')
    }
    dispatch(newTripSaga(uid1))
  }

  const newTrip = () => {
		if(!tripName || !designer|| !uid || !domestic || !city || !country || !tags || !cover){
      return alert('有未填项！')
    }
    const obj = {
      tripName: tripName.trim(),
      designer: designer.trim(),
      uid: uid,
      city: city,
      country: country,
      tags: tags,
      domestic: parseInt(domestic),
      cover: cover.trim()
    }
    dispatch(newTripSaga(obj))
	}

  const filterTags = (str, str1) => {
    //return str1.split('/').includes(str)
    return str1.split('/').indexOf(str)
  }

  const filterTags1 = (num, numArr) => {
    return numArr.indexOf(num)
  }

  const handleClick = (item, index) => {
    if(tags === ''){
      setTags(item)
    } else if(filterTags(item, tags) > -1){
      let newA = tags.split('/')
      let index = newA.indexOf(item)
      newA.splice(index, 1)
      let str = newA.join('/')
      setTags(str)
    } else {
      setTags(`${tags}/${item}`)
    }
    if(array.length === 0){
      setArray([index])
    } else if(filterTags1(index, array) > -1){
      let index1 = filterTags1(index, array)
      let newA = [...array]
      newA.splice(index1, 1)
      setArray(newA)
    } else {
      setArray([...array, index])
    }
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
          label="城市（英文 / 分割）" 
          variant="outlined"
          onChange={(e) => {setCity(e.target.value)}}
        />
        <TextField 
          className={classes.submit} 
          id="country" 
          label="国家（英文 / 分割）" 
          variant="outlined"
          onChange={(e) => {setCountry(e.target.value)}}
        />
        <div className={classes.form1}>
          <TextField
            value={tags}
            //className={classes.submit} 
            id="tags" 
            label="标签（英文 / 分割）" 
            variant="outlined"
            //onChange={(e) => {setTags(e.target.value)}}
          />
          <div className={classes.chip}>
          {
            tagsArray.map((item, index) => {
              return (
                <div key={index} className={classes.chipContainer}>
                  <Chip 
                    label={item}
                    color="primary"
                    variant={array.includes(index) ?  "default" : "outlined"}
                    onClick={() => handleClick(item, index)} 
                  />
                </div>
              )
            })
          }
          </div>
        </div>
        <TextField 
          className={classes.submit} 
          id="cover" 
          label="封面图" 
          variant="outlined"
          onChange={(e) => {setCover(e.target.value)}}
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
