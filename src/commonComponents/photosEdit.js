import React, {useState, useEffect, memo, useCallback, useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, CircularProgress, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import Bar from '../components/appbar';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import axios from 'axios'
import LazyLoad from 'react-lazyload';
import{
    setPageIndex
} from '../store/action'
import HighlightOff from '@material-ui/icons/HighlightOff';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles(theme => ({
	listContainer: {
        marginTop: theme.spacing(10),
        marginBottom: theme.spacing(2),
        padding: 0
    },
    btn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: theme.spacing(2, 0),
        position: 'sticky',
        bottom: 0,
        backgroundColor: 'white',
        borderTop: `1px solid ${theme.palette.divider}`
    },
    imgContainer:{
        position: 'relative',
        width: '100%',
        paddingBottom: '100%',
        overflow: 'hidden',
        backgroundColor: theme.palette.grey[100],
        borderRadius: theme.shape.borderRadius,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: theme.shadows[4],
        }
    },
    img: {
        position: 'absolute',
        top: 4,
        left: 4,
        right: 4,
        bottom: 4,
        width: 'calc(100% - 8px)',
        height: 'calc(100% - 8px)',
        objectFit: 'cover',
        borderRadius: theme.shape.borderRadius
    },
    dele: {
        position: 'absolute',
        right: 8,
        top: 8,
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '50%',
        padding: 4,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.7)',
            transform: 'scale(1.1)'
        }
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        width: '100%'
    },
    emptyContainer: {
        textAlign: 'center',
        padding: theme.spacing(4),
        color: theme.palette.text.secondary
    }
}));

const PhotoItem = memo(({item, index, onDelete, onJump, classes, deleting, imageErrors, onImageError}) => (
    <Grid item xs={4} sm={3} md={2} key={item._id || index}>
        <div 
            className={classes.imgContainer} 
            onClick={() => onJump(item)}
        >
            <LazyLoad height={'100%'} offset={100}>
                <img 
                    alt='' 
                    className={classes.img}
                    src={imageErrors.has(item._id) ? '/placeholder.jpg' : item.picURL}
                    onError={() => onImageError(item._id)}
                    loading="lazy"
                />
            </LazyLoad>
            <div 
                className={classes.dele}
                onClick={(e) => onDelete(index, item, e)}
                style={{ opacity: deleting.has(item._id) ? 0.5 : 1 }}
            >
                {deleting.has(item._id) ? <CircularProgress size={24} color="inherit" /> : <HighlightOff />}
            </div>
        </div>
    </Grid>
));

function TotalStorys({dispatch, item, history, pageIndex}){
    const classes = useStyles();
    const [total, setTotal] = useState(null)
    const [dataArray, setDataArray] = useState([])
    const [cache, setCache] = useState({})
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(new Set())
    const [imageErrors, setImageErrors] = useState(new Set())
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

    const fetchPhotos = useCallback(async (page) => {
        if (cache[page]) {
            setDataArray(cache[page].items);
            setTotal(cache[page].total);
            return;
        }
        
        setLoading(true);
        try {
            const res = await axios.get('/api/trip/getPhotos', {params: {page}});
            const newData = { items: res.data.items, total: res.data.total };
            setCache(prev => ({...prev, [page]: newData}));
            setDataArray(res.data.items);
            setTotal(res.data.total);
        } catch (error) {
            console.error('Fetch photos error:', error);
            setSnackbar({ open: true, message: '加载图片失败', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, [cache]);

    useEffect(() => {
        fetchPhotos(pageIndex);
        // 页码改变时滚动到顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [pageIndex, fetchPhotos])
    const scrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const previous = useCallback(() => {
        if (pageIndex > 1) {
            dispatch(setPageIndex(pageIndex - 1));
            scrollToTop();
        }
    }, [dispatch, pageIndex, scrollToTop]);

    const next = useCallback(() => {
        if (pageIndex < total) {
            dispatch(setPageIndex(pageIndex + 1));
            scrollToTop();
        }
    }, [dispatch, pageIndex, total, scrollToTop]);

    const handleJump = useCallback((item) => {
        history.push({pathname: '/photosInput', params: item});
    }, [history]);

    const handleImageError = useCallback((itemId) => {
        setImageErrors(prev => new Set(prev).add(itemId));
    }, []);

    const handleDelete = useCallback(async (index, item, e) => {
        e.stopPropagation();
        if (deleting.has(item._id)) return;
        
        setDeleting(prev => new Set(prev).add(item._id));
        try {
            const data = await axios.post('/api/trip/deletePhoto', {id: item._id});
            if (data.data) {
                setDataArray(prev => prev.filter((_, i) => i !== index));
                // 清理相关缓存
                setCache(prev => {
                    const newCache = {...prev};
                    Object.keys(newCache).forEach(key => {
                        newCache[key].items = newCache[key].items.filter(cacheItem => cacheItem._id !== item._id);
                    });
                    return newCache;
                });
                setSnackbar({ open: true, message: '删除成功', severity: 'success' });
            } else {
                setSnackbar({ open: true, message: '删除失败', severity: 'error' });
            }
        } catch (error) {
            console.error('Delete error:', error);
            setSnackbar({ open: true, message: '删除失败', severity: 'error' });
        } finally {
            setDeleting(prev => {
                const newSet = new Set(prev);
                newSet.delete(item._id);
                return newSet;
            });
        }
    }, [deleting]);

    const handleCloseSnackbar = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    const memoizedPhotos = useMemo(() => {
        return dataArray.map((item, index) => (
            <PhotoItem 
                key={item._id || index}
                item={item}
                index={index}
                onDelete={handleDelete}
                onJump={handleJump}
                classes={classes}
                deleting={deleting}
                imageErrors={imageErrors}
                onImageError={handleImageError}
            />
        ));
    }, [dataArray, handleDelete, handleJump, classes, deleting, imageErrors, handleImageError]);
	return (
		<div>
			<Bar title={'全部图片：'} history={history}/>
            <div className={classes.listContainer}>
                {loading && dataArray.length === 0 ? (
                    <div className={classes.loadingContainer}>
                        <CircularProgress />
                    </div>
                ) : dataArray && dataArray.length > 0 ? (
                    <Grid container spacing={1} style={{margin: 0, width: '100%'}}>
                        {memoizedPhotos}
                    </Grid>
                ) : (
                    <div className={classes.emptyContainer}>
                        <p>暂无图片</p>
                    </div>
                )}
            </div>
            
            {dataArray && dataArray.length > 0 && (
                <div className={classes.btn}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        disabled={pageIndex === 1 || loading} 
                        onClick={previous}
                    >
                        上一页
                    </Button>
                    <span>第 {pageIndex} 页 / 共 {total} 页</span>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        disabled={pageIndex === total || loading} 
                        onClick={next}
                    >
                        下一页
                    </Button>
                </div>
            )}
            
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={4000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
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
