import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Bar from '../components/appbar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import{
  newItemSaga
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

function Story({dispatch, item}){
  useEffect(()=>{
    
  })

	const classes = useStyles();
	const [articleName, setArticleName] = useState(item)
  const [picURL, setPicURL] = useState(item)
  const [articleURL, setArticleURL] = useState(item)
  const newTrip = () => {
		if(!articleName || !picURL|| !articleURL){
      return alert('有未填项！')
    }
    const obj = {
      articleName: articleName.trim(),
      picURL: picURL.trim(),
      articleURL: articleURL
    }
    dispatch(newItemSaga(obj))

    setArticleName(item)
    setPicURL(item)
    setArticleURL(item)
	}
  
	return (
		<div className={classes.root}>
			<Bar title={'瀑布流页面数据新增：'} />
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
        <Button 
          variant="contained" 
          color="primary" 
          className={classes.submit}
          onClick={newTrip}
        >
          提交
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
