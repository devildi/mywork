import React from 'react';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { authority, avatarUrl } from '../tools'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    overflow: 'hidden'
  },
  avatar: {
  	width: theme.spacing(13),
    height: theme.spacing(13),
  },
  btn: {
  	marginTop: theme.spacing(4),
  	width: theme.spacing(20),
  },
  paper: {
    height: theme.spacing(10),
    fontSize: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    padding: theme.spacing(5,1,0,1)
  }
}));

export default function Profile ({user, logout, history, flag}) {
	const classes = useStyles();
  const logon = () => {
    if(user === authority){
      history.push('/logon')
    }
  }

  const pushTo = (str) => {
    history.push({pathname: str});
  }

	return (
		<div className={classes.root}>
			<Avatar 
        className={classes.avatar}
        onClick={logon}
        src={avatarUrl}
      >
        {user}
      </Avatar>
      <Grid container spacing={1} className={classes.container}>
        <Grid item xs={6}>
          <Paper elevation={3} className={classes.paper} onClick={() => pushTo('/photosInput')}>照片录入</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} className={classes.paper} onClick={() => pushTo('/photosEdit')}>所有照片</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} className={classes.paper} onClick={() => pushTo('/story')}>瀑布流数据编辑</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} className={classes.paper} onClick={() => pushTo('/totalStorys')}>所有瀑布流数据</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} className={classes.paper} onClick={() => pushTo('/editinit')}>行程设计</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} className={classes.paper} onClick={() => pushTo('/totalTrips')}>全部行程</Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} className={classes.paper} onClick={() => pushTo('/client')}>{flag ? '有新增用户' : 'NextSticker的全体客户'}</Paper>
        </Grid>
      </Grid>
			<Button
        variant="contained"
        color="secondary"
        startIcon={<ExitToApp />}
        className={classes.btn}
        onClick={() => logout()}
      >
        退出登录
      </Button>
		</div>
	)
}