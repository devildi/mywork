import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Bar from '../components/appbar';
import { picUrl } from '../tools'
import axios from 'axios'
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  content: {
    padding: theme.spacing(10, 0, 0, 4),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    minHeight: '80vh',  // 确保有足够的高度以显示居中文字
  },
  square: {
    width: 100,
    height: 100,
    cursor: 'pointer',
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    overflow: 'hidden',
    backgroundColor: 'pink',  // 默认背景色
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform 0.2s',
    },
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',  // 防止图片底部有间隙
  },
  emptyMessage: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.5rem',
    color: '#666',
  },
  dialogImage: {
    maxWidth: '100%',
    maxHeight: '70vh',  // 减小图片高度以适应输入框
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
  }
}));

export default function Preview({ history, location}) {
  const [pics, setPics] = useState([])
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [tripName, setTripName] = useState('');
  const [nameOfScence, setNameOfScence] = useState('');
  const [open, setOpen] = useState(false);
  const [isCover, setIsCover] = useState(false);
  const classes = useStyles();

  useEffect(()=>{
    axios.get('/api/trip/previewImgs')
    .then(res => {
      setPics(res.data)
    })
    .catch(err => console.error('Error fetching images:', err));
  }, [])



  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  const handleImageClick = (item) => {
    console.log(item)
    setOpen(true)
    setSelectedImage(item.url);
    setImageUrl(item.url);
    setTripName(item.tripName)
    setNameOfScence(item.nameOfScence)
    setIsCover(item.cover)
  };

  const handleClose = () => {
    setSelectedImage(null);
    setImageUrl('');
    setTripName('');
    setNameOfScence('');
    setOpen(false)
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setImageUrl(newUrl);
    setSelectedImage(newUrl);  // 同时更新显示的图片
  };

  const handleSave = () => {
    console.log({
      "url": imageUrl,
      "nameOfScence": nameOfScence,
      "tripName": tripName,
      "cover": isCover
    })
    axios.post('/api/trip/updatePointImg', {
      "url": imageUrl,
      "nameOfScence": nameOfScence,
      "tripName": tripName,
      "cover": isCover
    })
    .then(res => {
      handleClose()
    })
    .catch(err => console.error('Error fetching images:', err));
  };

  return (
    <div className={classes.root}>
      <Bar title={'图片预览'} history={history}/>
      <div className={classes.content}>
        {
          pics.length > 0
          ? pics.map((item, index) => (
            <div 
              key={index} 
              className={classes.square}
              onClick={() => handleImageClick(item)}
            >
              <img 
                src={item.url}
                alt={`preview-${index}`}
                className={classes.image}
                onError={handleImageError}
              />
            </div>
          ))
          : <div className={classes.emptyMessage}>
              暂无图片
            </div>
        }
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
      >
        <DialogContent>
          <img
            src={selectedImage}
            alt="preview"
            className={classes.dialogImage}
            onError={handleImageError}
          />
          <div className={classes.inputContainer}>
            <TextField
              className={classes.input}
              value={imageUrl}
              onChange={handleUrlChange}
              variant="outlined"
              size="small"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
