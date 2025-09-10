import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Bar from '../components/appbar';
import axios from 'axios'
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

// 图片优化函数 - 仅在支持的情况下应用
const getOptimizedImageUrl = (url, width = 100, height = 100, quality = 80) => {
  if (!url) return url;
  
  // 检查是否为外部图片服务（如CDN）才应用优化参数
  const isExternalImage = url.includes('cdn') || url.includes('oss') || url.includes('qiniu') || url.includes('amazonaws');
  
  if (!isExternalImage) {
    // 本地或不支持的服务器，直接返回原URL
    return url;
  }
  
  // 检查是否支持 WebP
  const supportsWebP = (() => {
    try {
      return document.createElement('canvas')
        .toDataURL('image/webp').indexOf('webp') > -1;
    } catch {
      return false;
    }
  })();
  
  // 构建优化参数
  const params = new URLSearchParams();
  params.append('w', width);
  params.append('h', height);
  params.append('q', quality);
  if (supportsWebP) {
    params.append('format', 'webp');
  }
  
  // 如果URL已经有参数，使用&连接，否则使用?
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  content: {
    padding: theme.spacing(10, 2, 0, 2),
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
    gap: theme.spacing(1.5),
    minHeight: '80vh',
    gridAutoRows: 'max-content',
  },
  squareContainer: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflow: 'hidden',
    height: 'fit-content',
    margin: theme.spacing(0.5),
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  },
  square: {
    width: '100%',
    aspectRatio: '1',
    cursor: 'pointer',
    overflow: 'hidden',
    backgroundColor: theme.palette.grey[100],
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.2s ease-in-out',
  },
  sceneName: {
    textAlign: 'center',
    fontSize: '0.8rem',
    padding: theme.spacing(0.5, 1),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    backgroundColor: '#f9f9f9',
    borderTop: '1px solid #eee',
    minHeight: '2em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMessage: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.5rem',
    color: '#666',
  },
  loadingContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(3, 0),
    gap: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(2),
  },
  paginationButton: {
    minWidth: 40,
    height: 40,
    borderRadius: '50%',
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: 'white',
    },
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      border: `1px solid ${theme.palette.primary.main}`,
    },
    '&.disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
      '&:hover': {
        backgroundColor: 'white',
        color: 'inherit',
      },
    },
  },
  pageInfo: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
    padding: theme.spacing(0, 2),
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
  },
  divContainer: {
    marginLeft: theme.spacing(1),
  }
}));

export default function Preview({ history, location}) {
  const [allPics, setAllPics] = useState([]) // 所有图片数据
  const [currentPage, setCurrentPage] = useState(1) // 当前页码
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [tripName, setTripName] = useState('');
  const [nameOfScence, setNameOfScence] = useState('');
  const [open, setOpen] = useState(false);
  const [isCover, setIsCover] = useState(false);
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const classes = useStyles();
  
  // 分页参数
  const ITEMS_PER_PAGE = 85; // 每页显示85张图片
  const totalPages = Math.ceil(allPics.length / ITEMS_PER_PAGE);
  
  // 获取当前页图片
  const currentPics = allPics.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 图片预加载功能
  const preloadImages = useCallback((imageList, count = 85) => {
    imageList.slice(0, count).forEach(item => {
      if (item.url) {
        const img = new Image();
        img.src = item.url;
      }
    });
  }, []);
  
  // 翻页函数
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 预加载当前页图片
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pagePics = allPics.slice(startIndex, endIndex);
    preloadImages(pagePics, ITEMS_PER_PAGE);
  }, [allPics, preloadImages]);

  useEffect(()=>{
    setInitialLoading(true);
    axios.get('/api/trip/previewImgs')
    .then(res => {
      setAllPics(res.data)
      // 预加载前85张图片（第一页）
      if (res.data && res.data.length > 0) {
        preloadImages(res.data, ITEMS_PER_PAGE);
      }
    })
    .catch(err => console.error('Error fetching images:', err))
    .finally(() => setInitialLoading(false));
  }, [preloadImages])

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
      setAllPics(prevPics => 
        prevPics.map(item => 
          item.nameOfScence === nameOfScence 
            ? { ...item, url: imageUrl} 
            : item
        )
      )
      handleClose()
    })
    .catch(err => console.error('Error fetching images:', err));
  };

  const handleGetImage = async () => {
    setLoading(true); // 开始加载
    try {
      await getIMG(); // 调用获取图片的函数
    } catch (error) {
      console.error("获取图片失败:", error);
    } finally {
      setLoading(false); // 无论成功或失败，都结束加载
    }
  };


  const getIMG = async() => {
    return new Promise((resolve, reject) => {
      if(nameOfScence){
      axios.get('/api/trip/getBingImg', {
        params: {
          point: nameOfScence
        }
      })
      .then(res => {
        console.log(res.data, loading)
        if(res.data){
          setImageUrl(res.data)
          setSelectedImage(res.data)
          resolve();
        }      
        })
      .catch(err => {
        console.error('Error fetching images:', err)
        reject(err)
      });
      }
    })
  }

  return (
    <div className={classes.root}>
      <Bar title={'图片预览'} history={history}/>
      <div className={classes.content}>
        {initialLoading ? (
          <div className={classes.loadingContainer}>
            <Typography>Loading...</Typography>
          </div>
        ) : currentPics.length > 0 ? (
          currentPics.map((item, index) => (
            <div 
              key={`${currentPage}-${index}`}
              className={classes.squareContainer}
            >
              <div 
                className={classes.square}
                onClick={() => handleImageClick(item)}
              >
                <img 
                  src={item.url}
                  alt={`preview-${index}`}
                  className={classes.image}
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
              <Typography variant="body2" className={classes.sceneName}>
                {item.nameOfScence}
              </Typography>
            </div>
          ))
        ) : (
          <div className={classes.emptyMessage}>
            暂无图片
          </div>
        )}
      </div>
      
      {/* 分页组件 */}
      {totalPages > 1 && (
        <div className={classes.paginationContainer}>
          {/* 上一页 */}
          <div 
            className={`${classes.paginationButton} ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          >
            ‹
          </div>
          
          {/* 页码 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
            // 显示逻辑：显示当前页前后2页，加上第一页和最后一页
            const showPage = page === 1 || page === totalPages || 
                           Math.abs(page - currentPage) <= 2;
            
            if (!showPage) {
              // 显示省略号
              if (page === currentPage - 3 || page === currentPage + 3) {
                return (
                  <span key={page} className={classes.pageInfo}>
                    ...
                  </span>
                );
              }
              return null;
            }
            
            return (
              <div
                key={page}
                className={`${classes.paginationButton} ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </div>
            );
          })}
          
          {/* 下一页 */}
          <div 
            className={`${classes.paginationButton} ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          >
            ›
          </div>
          
          {/* 页码信息 */}
          <div className={classes.pageInfo}>
            第 {currentPage} 页 / 共 {totalPages} 页 (共 {allPics.length} 张图片)
          </div>
        </div>
      )}
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
            key={selectedImage}
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
              className={classes.divContainer}
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              保存
            </Button>
            <Button
              className={classes.divContainer}
              variant="contained"
              color="primary"
              onClick={handleGetImage}
            >
              {
               loading ? '获取中...' : '获取图片'
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}