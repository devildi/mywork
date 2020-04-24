import React from 'react';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { makeStyles } from '@material-ui/core/styles';

import { authority } from '../tools'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
  	width: theme.spacing(13),
    height: theme.spacing(13),
  },
  btn: {
  	marginTop: theme.spacing(4),
  	width: theme.spacing(20),
  }
}));

export default function Profile ({user, logout, history}) {
	const classes = useStyles();
  const logon = () => {
    if(user === authority){
      history.push('/logon')
    }
  }

	return (
		<div className={classes.root}>
			<Avatar 
      className={classes.avatar}
      onClick={logon}
      >
        {user}
      </Avatar>
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