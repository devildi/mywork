import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Bar from '../components/appbar';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import axios from 'axios'
import{
    setPageIndex
} from '../store/action'
import HighlightOff from '@material-ui/icons/HighlightOff';

const useStyles = makeStyles(theme => ({
	listContainer: {
        margin: theme.spacing(8,0,2,0),
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    btn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: theme.spacing(0,0,1,0)
    },
    imgContainer:{
        margin: theme.spacing(1,0,0,1),
        position: 'relative',
        width: '200px',
        height: '200px',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0'
    },
    img: {
        display: 'block',
        maxHeight: '100%',
        height: 'auto'
    },
    img2: {
        display: 'block',
        maxWidth: '100%',
        width: 'auto'
    },
    dele: {
        position: 'absolute',
        right: 0,
        top: 0,
        color: 'white',
    }
}));

function TotalStorys({dispatch, item, history, pageIndex}){
    const classes = useStyles();
    const [total, setTotal] = useState(null)
    const [dataArray, setDataArray] = useState([])
    useEffect(()=>{
        axios.get('/api/trip/getPhotos',{params: {page: pageIndex}})
        .then((res) => {
            //console.log(res.data.allItems.length)
            setDataArray(res.data.items)
            setTotal(res.data.total)
        })
        .catch((err) => alert(err))
    },[pageIndex])
    const previous = async() => {
        const data = await axios.get('/api/trip/getPhotos',{params: {page: pageIndex - 1}})
        setDataArray(data.data.items)
        dispatch(setPageIndex(pageIndex - 1))
    }
    const next = async() => {
        const data = await axios.get('/api/trip/getPhotos',{params: {page: pageIndex + 1}})
        setDataArray(data.data.items)
        dispatch(setPageIndex(pageIndex + 1))
    }
    const _jump = (item) => {
        history.push({pathname: '/photosInput', params: item});
    }
    const dele = async(index, item, e) => {
        e.stopPropagation()
        const data = await axios.post('/api/trip/deletePhoto',{id: item._id})
        if(data.data){
            alert("已删除！")
            dataArray.splice(index, 1)
            setDataArray([...dataArray])
        } else {
            alert("系统错误！")
        }
    }
	return (
		<div >
			<Bar title={'全部图片：'} history={history}/>
            <div className={classes.listContainer}>
            {
                dataArray && dataArray.length > 0
                ?dataArray.map((item, index) => (
                    <div 
                        key={index} 
                        className={classes.imgContainer} 
                        onClick={() => _jump(item)}
                    >
                        <img 
                            alt='' 
                            className={item.width > item.height ? classes.img : classes.img2} 
                            src={item.picURL}
                        />
                        <div 
                            className={classes.dele}
                            onClick={(e) => dele(index, item, e)} 
                        >
                            <HighlightOff />
                        </div>
                    </div>
                ))
                : null
            }
            </div>
            <div className={classes.btn}>
                {
                    dataArray && dataArray.length > 0
                    ?<React.Fragment>
                        <Button variant="contained" color="primary" disabled={pageIndex === 1} onClick={previous}>
                            上一页
                        </Button>
                        <Button variant="contained" color="primary" disabled={pageIndex === total} onClick={next}>
                            下一页
                        </Button>
                    </React.Fragment>
                    : null
                }
            </div>
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
)(TotalStorys);
