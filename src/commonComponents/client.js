import React, { useEffect} from 'react';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Bar from '../components/appbar';
//import { connect } from 'react-redux';
import { 
  getScrollTop,
  getClientHeight,
  getScrollHeight,
} from '../tools';

const useStyles = makeStyles(theme => ({
	root: {
    margin: theme.spacing(2,2,0,2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: 'center',
  },
  div: {
    margin: theme.spacing(5,1,1,1),
  },
  div1: {
    width: '100%',
    height: theme.spacing(6),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
}));

export default function Client(){
  const [total, setTotal] = React.useState(0)
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  useEffect(()=>{
    getdata()
  },[])

  useEffect(()=>{
    window.addEventListener('scroll', scroll)
    return () => {
      window.removeEventListener('scroll', () => {})
    }
  })

  const scroll = () => {
    if((getScrollHeight() - getScrollTop() - getClientHeight()) <= 20 && !loading){
      if(users.length < total){
        
      } else {
        return 
      }
    }
  }

	const classes = useStyles();

  const getdata = () => {
    axios.get('/api/users/getClient')
    .then((res) => {
      if(res.status === 200){
        setTotal(res.data.length)
        setUsers(res.data)
      }
    })
    .catch((err)=>{
      alert(err)
    })
  }
  
	return (
		<div className={classes.root}>
			<Bar title={`NextSticker的总用户为 ${total}`} />
      <div className={classes.div}></div>
      {
        users.length > 0
        ?<React.Fragment>
        {
          users.map((item, index) => (
            <div className={classes.div1} key={index}>
              <div>目的地：{item.destination}</div><div>微信号：{item.wechat}</div>
            </div>
          ))
        }
        </React.Fragment>
        :<div className={classes.div2}>暂时无用户！</div>
      }
		</div>
	)
}

// export default connect(
//   function mapStateToProps(state) {
//     return state;
//   },
//   function mapDispatchToProps(dispatch) {
//     return { dispatch };
//   }
// )(Client);
