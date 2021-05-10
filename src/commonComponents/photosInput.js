import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Bar from '../components/appbar';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { fomatURL } from '../tools'
import axios from 'axios'

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

function PhotosInput({dispatch, item, history, location}){
  useEffect(()=>{
    
  })
  const passedData = location.params
  
  const classes = useStyles();
  const [loading, setLoading] = useState(false)

  const [tags, setTags] = useState(passedData? passedData.tags :'')
  const [picURL, setPicURL] = useState(passedData? passedData.picURL :'')
  const [des, setDes] = useState(passedData? passedData.des :'')
  const [width, setWidth] = useState(passedData && passedData.width !== undefined ? passedData.width :0)
  const [height, setHeight] = useState(passedData && passedData.height !== undefined ? passedData.height :0)

  const newTrip = () => {
    if(!picURL){
      return alert('请填写图片地址！')
    }
    if(width === 0 || height === 0){
      return alert('请填写图片宽高！')
    }
    const obj = {
      tags: tags.trim(),
      picURL: fomatURL(picURL.trim()),
      des: des.trim(),
      width: width,
      height: height
    }
    if(!passedData){
      axios.post('/api/trip/photoInput',{...obj})
      .then((res) => {
          if(res.data){
              alert("提交成功！")
              setTags('')
              setPicURL('')
              setDes('')
              setWidth(0)
              setHeight(0)
          }else{
              alert("图片提交出错！")
          }
      })
      .catch((err) => {
          alert("图片提交出错！")
      })
    }else{
      let updatedObj = {...passedData, ...obj}
      axios.post('/api/trip/updatePhoto',updatedObj)
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
    let data = await axios.get('/api/trip/getImgWAH',{params: {url: fomatURL(picURL)}})
    // console.log(data.data)
    if(data.data === 'error'){
      alert('获取图片宽高出错，请检查图片URL！')
    } else {
      setWidth(data.data.width)
      setHeight(data.data.height)
    }
    setLoading(false)
  }
  
	return (
		<div className={classes.root}>
			<Bar title={passedData ? '照片修改：' : '照片数据新增：'} history={history}/>
            <form className={classes.form} noValidate autoComplete="off">
                <TextField
                    value={tags}
                    className={classes.submit} 
                    id="tags" 
                    label="图片标签，以 | 分割" 
                    variant="outlined"
                    onChange={(e) => {setTags(e.target.value)}}
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
                    value={des}
                    className={classes.submit} 
                    id="sth" 
                    label="图片描述" 
                    variant="outlined"
                    onChange={(e) => {setDes(e.target.value)}}
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
                    disabled={picURL && width > 0 && height > 0 ? false: true}
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
)(PhotosInput);
