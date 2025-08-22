import React, { useState, useEffect } from 'react';
import Bar from '../components/appbar';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import io from 'socket.io-client';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    padding: theme.spacing(2),
    boxSizing: 'border-box',
  },
  toolbar: theme.mixins.toolbar,
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    boxSizing: 'border-box',
  },
  text: {
    fontSize: '14px',
    color: theme.palette.text.primary,
    paddingLeft: theme.spacing(1),
  },
  progressList: {
    marginTop: theme.spacing(2),
    maxHeight: '400px',
    overflowY: 'auto',
    border: '1px solid #ccc',
    padding: theme.spacing(1),
    borderRadius: 4,
  },
  progressItem: {
    marginBottom: theme.spacing(1),
  },
}));

const Test = ({ dispatch, history }) => {
  const classes = useStyles();
  const [status, setStatus] = useState('等待检测...');
  const [progress, setProgress] = useState([]); // 存储每个景点的进度
  const [socket, setSocket] = useState(null);

  // 初始化 Socket.IO 连接
  useEffect(() => {
    const s = io(); // 默认连接当前域名
    setSocket(s);

    s.on('progress', data => {
      setProgress(prev => [...prev, data]); // 每次收到新的进度追加
    });

    return () => {
      s.disconnect();
    };
  }, []);

  // 点击按钮调用服务器接口，将任务加入队列
  const handleCheck = async () => {
    setStatus('正在检测...');
    setProgress([]); // 重置进度列表
    try {
      const res = await axios.get('/api/trip/checkUrlQueue'); // 后端队列接口
      if (res.data && res.data.message) {
        setStatus('任务已加入后台队列');
      } else {
        setStatus('任务已加入后台队列');
      }
    } catch (err) {
      setStatus('任务加入失败');
    }
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Bar title={'测试'} history={history} />

      <div className={classes.toolbar} />

      <div className={classes.root}>
        <div className={classes.row}>
          <Button variant="contained" color="primary" onClick={handleCheck}>
            检测图片链接
          </Button>
          <span className={classes.text}>{status}</span>
        </div>

        {/* 实时进度列表 */}
        <div className={classes.progressList}>
          {progress.map((item, index) => (
            <div key={index} className={classes.progressItem}>
              {item.tripName} - {item.pointName}: {item.status}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default connect(
  state => state,
  dispatch => ({ dispatch })
)(Test);
