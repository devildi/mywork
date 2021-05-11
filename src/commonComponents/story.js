import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Bar from '../components/appbar';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';

import axios from 'axios'

import{
  newItemSaga
} from '../store/action'

const useStyles = makeStyles(theme => ({
	root: {
    padding: theme.spacing(2,2,0,2),
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

function Story({dispatch, item, history, location}){
  useEffect(()=>{
    
  })
  
  const passedData = location.params
	const classes = useStyles();
  const [loading, setLoading] = useState(false)
	const [articleName, setArticleName] = useState(passedData? passedData.articleName :item)
  const [picURL, setPicURL] = useState(passedData? passedData.picURL :item)
  const [articleURL, setArticleURL] = useState(passedData? passedData.articleURL :item)
  const [width, setWidth] = useState(passedData && passedData.width !== undefined ? passedData.width :0)
  const [height, setHeight] = useState(passedData && passedData.height !== undefined ? passedData.height :0)

  const newTrip = () => {
    if(!articleName || !picURL|| !articleURL){
      return alert('有未填项！')
    }
    const obj = {
      articleName: articleName.trim(),
      picURL: picURL.trim(),
      articleURL: articleURL,
      width: width,
      height: height
    }
    if(!passedData){
      dispatch(newItemSaga(obj))
  
      setArticleName(item)
      setPicURL(item)
      setArticleURL(item)
      setWidth(0)
      setHeight(0)
    } else {
      //console.log("update")
      let updatedObj = {...passedData, ...obj}
      console.log(updatedObj)
      axios.post('/api/trip/updateItem',updatedObj)
      .then((res) => {
        if(res.status === 200 ){
          alert("更改成功！")
        }else{
          alert("系统出错，请重试！")
        }
      })
      .catch((err) => {
        alert(err)
      })
    }
	}

  const getWidthAndHeight = async() => {
    setLoading(true)
    //console.log(picURL)
    //let img = await getOrigiHeight(picURL)
    //console.log(img.height, img.width)
    let data = await axios.get('/api/trip/getImgWAH',{params: {url: picURL}})
    console.log(data.data)
    setWidth(data.data.width)
    setHeight(data.data.height)
    setLoading(false)
  }
  
	return (
		<div className={classes.root}>
			<Bar title={passedData ? '瀑布流页面数据修改：' : '瀑布流页面数据新增：'} history={history}/>
    	<form className={classes.form} noValidate autoComplete="off">
        <TextField
          value={articleName}
          className={classes.submit} 
          id="number" 
          label="文章名字" 
          variant="outlined"
          onChange={(e) => {setArticleName(e.target.value)}}
        />
        <TextField
          value={picURL}
          className={classes.submit} 
          id="name" 
          label="图片地址" 
          variant="outlined"
          onChange={(e) => {setPicURL(e.target.value)}}
        />
        <TextField 
          value={articleURL}
          className={classes.submit} 
          id="sth" 
          label="页面地址" 
          variant="outlined"
          onChange={(e) => {setArticleURL(e.target.value)}}
        />
        <TextField 
          value={width}
          className={classes.submit} 
          id="width" 
          label="图片宽度" 
          variant="outlined"
          type="number"
          onChange={(e) => {setWidth(e.target.value)}}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={getWidthAndHeight}
                  disabled={!picURL || loading}
                >
                  {loading ? 'Loading': '获取宽度'}
                </Button>
              </InputAdornment>
            ),
          }}
        />
        <TextField 
          value={height}
          className={classes.submit} 
          id="height" 
          label="图片高度"
          type="number"
          variant="outlined"
          onChange={(e) => {setHeight(e.target.value)}}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={getWidthAndHeight}
                  disabled={!picURL || loading}
                >
                  {loading ? 'Loading': '获取高度'}
                </Button>
              </InputAdornment>
            ),
          }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          className={classes.submit}
          onClick={newTrip}
          disabled={picURL && width > 0 && height > 0 && articleName && articleURL ? false: true}
        >
          {passedData? '保存更改' : '提交' }
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
)(Story);
