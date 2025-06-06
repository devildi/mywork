import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Bar from '../components/appbar';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import axios from 'axios'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import{
    setPageIndex
} from '../store/action'

const useStyles = makeStyles(theme => ({
	listContainer: {
        padding: theme.spacing(8,0,1,0),
    },
    btn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        margin: theme.spacing(0,0,1,0)
    }
}));

function TotalTrips({dispatch, item, history, pageIndex}){
    const classes = useStyles();
    const [total, setTotal] = useState(null)
    const [dataArray, setDataArray] = useState([])
    useEffect(()=>{
        axios.get('/api/trip/getAllTripByPage',{params: {page: pageIndex}})
        .then((res) => {

            setDataArray(res.data.items)
            setTotal(res.data.total) 
        })
        .catch((err) => alert(err))
    },[pageIndex])
    const previous = async() => {
        const data = await axios.get('/api/trip/getAllTripByPage',{params: {page: pageIndex - 1}})
        setDataArray(data.data.items)
        dispatch(setPageIndex(pageIndex - 1))
    }
    const next = async() => {
        const data = await axios.get('/api/trip/getAllTripByPage',{params: {page: pageIndex + 1}})
        setDataArray(data.data.items)
        dispatch(setPageIndex(pageIndex + 1))
    }
    const _jump = (item) => {
        history.push({pathname: '/edit', params: item});
    }
	return (
		<div >
			<Bar title={'全部行程数据：'} history={history}/>
            <List className={classes.listContainer}>
            {
                dataArray && dataArray.length > 0
                ?dataArray.map((item, index) => (
                    <ListItem button key={index} onClick={() => _jump(item)}>
                        <ListItemText 
                            primary={`${item.tripName} | ${item.detail.length}天 | ${item.city}`} 
                        />
                        <ListItemSecondaryAction>
                            <Button 
                                edge="end" 
                                aria-label="actions" 
                                onClick={(e) => {
                                    e.stopPropagation()// 防止触发ListItem的点击事件
                                    // 这里处理按钮点击事件
                                    axios.post('/api/trip/deleteItem', {uid: item.uid})
                                    .then((res) => {
                                        if(res.data){
                                            alert('删除成功')
                                            setDataArray(dataArray.filter((trip) => trip.uid !== item.uid))
                                        }else{
                                            alert('删除失败')
                                        }
                                    })
                                }}>
                                删除
                            </Button>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))
                : null
            }
            </List>
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
)(TotalTrips);
