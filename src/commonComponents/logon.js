import React , {useState} from 'react';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import InputBase from '@material-ui/core/InputBase';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {
  withStyles,
  makeStyles,
} from '@material-ui/core/styles';
import LockOpen from '@material-ui/icons/LockOpen';
import { connect } from 'react-redux';
import{
  registerSaga,
} from '../store/action'

import { 
  picUrl,
  vedioUrl,
  isVedio,
} from '../tools'

const useStyles = makeStyles(theme => ({
  vedioBackground: {
    position: 'fixed',//视频定位方式设为固定
    right: 0,
    bottom: 0,//视频位置
    minWidth: '100%',
    minHeight: '100%', //不会因视频尺寸造成页面需要滚动
    width: 'auto',
    height: 'auto', //尺寸保持原视频大小
    zIndex: -10,//z轴定位，小于0即可
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  background: {
    backgroundImage: `url(${picUrl[1]})`,
    position:'fixed',
    top: 0,
    left: 0,
    width:'100%',
    height:'100%',
    zIndex:-10,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  topBlock: {
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: 'center',
  },
  block: {
    height: '45px',
  },
  avatarContainer: {
    margin: theme.spacing(1),
    width: theme.spacing(10),
    height: theme.spacing(10),
    backgroundColor: theme.palette.secondary.main,
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    height: '45px'
  },
  fix: {
    position: 'absolute',
    textAlign: 'center',
    bottom: 0,
    right: 0,
    left: 0,
    color: '#fff'
  },
  font: {
    color: '#fff'
  }
}));

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderTop: props =>
      props.top === 'true'
        ? ''
        : 'none',
    borderBottom: props =>
      props.top === 'ture'
        ? 'none'
        : '',
    borderRadius: props => getBorderRadius(props),
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #fff',
    fontSize: 16,
    width: '100%',
    height: '24px',
    padding: '10px 12px',
  },

}))(InputBase);

function getBorderRadius(props){
  if(props.position === 'top'){
    return '5px 5px 0 0'
  } else if(props.position === 'bottom'){
    return '0 0 5px 5px'
  } else {
    return '0 0 0 0';
  }
}

function Copyright() {
  const classes = useStyles();
  return (
    <Typography 
      variant="body2" 
      color="textSecondary" 
      className={classes.fix}
    >
      {'Copyright © '}
      <Link color="inherit" href="/signin">
        DevilDI
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function LogOn({dispatch}) {
  const classes = useStyles();

  const [name, setName] = useState('')
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState('');

  const onSubmit = () => {
    if(name.trim() && password.trim() && auth.trim()){
      dispatch(registerSaga({
        name: name.trim(), 
        password: password.trim(),
        auth: auth.trim()
      }))
    } else {
      return alert('有未填的项目！')
    } 
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.topBlock}>
          <Avatar className={classes.avatarContainer}>
            <LockOutlinedIcon className={classes.avatar}/>
          </Avatar>
          <Typography component="h1" variant="h3" className={classes.font}>
            Log On
          </Typography>
        </div>
        <div className={classes.form} noValidate>
          <BootstrapInput 
            id="用户名"
            placeholder="用户名"
            type="text"
            style={{width:'100%'}}
            position="top"
            onChange={(e) => {setName(e.target.value)}}
          />
          <BootstrapInput 
            id="密码"
            placeholder="密码"
            type="text"
            style={{width:'100%'}}
            position="middle"
            onChange={(e) => {setPassword(e.target.value)}}
          />
          <BootstrapInput 
            id="授权码"
            placeholder="授权码"
            type="password"
            style={{width:'100%'}}
            position="bottom"
            onChange={(e) => {setAuth(e.target.value)}}
          />
          <div className={classes.block}></div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            startIcon={<LockOpen />}
            onClick={() => onSubmit()}
          >
            注册新用户
          </Button>
        </div>
      </div>
      <Copyright />
      {
        !isVedio
        ?<div className={classes.background}></div>
        :<video
          autoPlay
          loop
          muted
          className={classes.vedioBackground}
         >
           <source src={vedioUrl} type="video/mp4"  />
         </video>
      }
    </Container>
  );
}

export default connect(
  function mapStateToProps(state) {
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch };
  }
)(LogOn);