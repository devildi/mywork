import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import { connect } from 'react-redux';
import Link from '@material-ui/core/Link';
import { Daytrip, checkNullInObj, checkInArray } from '../tools'
import MapComponent from './mapView';
import GoogleMapComponent from './googleMapView';
import{
  saveTripSaga
} from '../store/action'
import clsx from 'clsx';

const drawerWidth = 200;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    //padding: theme.spacing(3),
  },
  contentMode: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawerTitle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  btn: {
    marginTop: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
  mapContainer: {
    // backgroundColor: theme.palette.secondary.main,
    // padding: 0,
    // margin: 0,
    // width: '100%',
    // height: '100%',
  },
  coverBTN: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'end'
  },
  coverUrlTextContainer: {
    width: '100%',
  }
}));

function ResponsiveDrawer({window, trip, dispatch, location}) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  
  const [data, setData] = React.useState(trip || location.params);

  const [open, setOpen] = React.useState(false)//模式
  
  //const tripRef = useRef();

  // useEffect(()=>{
  //   tripRef.current = trip
  //   console.log('tripRef.current',tripRef.current)
  // }, [])

  const change = (e, str, index) => {
    if(str === 'category'){
      data.detail[selectedIndex][index][str] = parseInt(e.target.value)
    }else {
      data.detail[selectedIndex][index][str] = e.target.value
    }
    setData({...data})
  }

  const changeCover = (valueURL) => {
    data.cover = valueURL
    setData({...data})
  }

  const removeItem = (index) => {
    data.detail[selectedIndex].splice(index, 1)
    setData({...data})
  }

  const removeDay = (e, index) => {
    e.stopPropagation()
    data.detail.splice(index, 1)
    setData({...data})
    if(index === selectedIndex){
      setSelectedIndex(0)
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const submit = () => {
    const array = data.detail
    for (let i = 0 ; i < array.length ; i++){
      let innerArray = array[i]
      for (let j = 0 ; j < innerArray.length ; j++){
        if(!checkNullInObj(innerArray[j])){
          return alert('有未填的项目！')
        }
      }
    }
    
    dispatch(saveTripSaga(data))
    // if(R.equals(data, tripRef.current)){
    //   alert('已保存！')
    // } else {
    //   alert('已发送！')
    // }
  }

  const changePlan = (arr) => {
    let newData = JSON.parse(JSON.stringify(data))
    newData.detail = arr
    console.log('终极数据：', newData)
    setData(newData)
  }

  const AddOneItem = (o) => {
    console.log(o)
    let obj = null
    if(o !== 'edit'){
      o.longitude = o.longitude.toString()
      o.latitude = o.latitude.toString()
      obj = {...o}
    } else {
      obj = new Daytrip()
    }
    console.log('即将存的值：',obj)
    if(data.detail.length > 0){
      data.detail[selectedIndex].push(obj)
      setData({...data})
    }
  }

  const FirstEditMode = () => {
    setOpen(!open)
  }

  const addOneDay = () => {
    data.detail.push([])
    setData({...data})
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} >
        <p className={classes.drawerTitle}>
          {data.tripName}
        </p>
        <p className={classes.drawerTitle}>
          {`by ${data.designer}`}
        </p>
        <p className={classes.drawerTitle}>
          {`城市：${data.city}`}
        </p>
        <p className={classes.drawerTitle}>
          {`国家：${data.country}`}
        </p>
        <p className={classes.drawerTitle}>
          {`标签：${data.tags}`}
        </p>
      </div>
      <img alt='' 
        src={data?.cover} 
        width={'100%'} 
        //height={'40px'}
        //onClick={()=>{setCoverDisplay(false)}} 
      />
      <div>
        <TextField 
          className={classes.coverUrlTextContainer}
          value={data?.cover || ''}
          id="cover" 
          label="封面" 
          //variant="outlined"
          onChange={(e) => {changeCover(e.target.value)}}
        />
      </div>
      <Divider />
      <List>
        <ListItem button onClick={addOneDay}>
          添加一日行程
          <ListItemIcon><AddIcon /></ListItemIcon>
        </ListItem>
        {
          data.detail != null && data.detail.length > 0
          ?data.detail.map((text, index) => (
            <ListItem 
              button 
              key={index} 
              selected={selectedIndex === index}
              onClick={() => {setSelectedIndex(index)}}
            >
              <ListItemText primary={`Day${index + 1}`}/>
              <ListItemIcon
                onClick={(e) => {removeDay(e, index)}}
              >
                <RemoveIcon />
              </ListItemIcon>
            </ListItem>
          ))
          : null
        }
      </List>
      <Divider />
    </div>
  )

  const container = window !== undefined ? () => window().document.body : undefined;
  //console.log(data.detail[selectedIndex])
  return (
    <div className={classes.root}>
      <CssBaseline />
      {
      data
      ?<React.Fragment>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap className={classes.title}>
              <Link color="inherit" href="/editinit">
                地图数据编辑
              </Link>
            </Typography>
            {
              data.detail.length > 0 && data.detail[selectedIndex] && data.detail[selectedIndex].length >= 0
              ?<Button style={{marginRight: '5px'}}variant="outlined" color="inherit" onClick={FirstEditMode}>{!open ? '编辑模式' : '地图模式'}</Button>
              : null
            }
            {
              open && data.detail.length > 0
              ?<Button style={{marginRight: '5px'}}variant="outlined" color="inherit" onClick={() => AddOneItem('edit')}>当天新增一点</Button>
              : null
            }
            {
              data.detail.length > 0 && checkInArray(data.detail)
              ?<Button variant="outlined" color="inherit" onClick={submit}>SAVE</Button>
              : null
            }
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={clsx(!open && classes.content, open && classes.contentMode)}>
        { 
          open && data.detail[selectedIndex] && data.detail[selectedIndex].length > 0
          ?data.detail[selectedIndex].map((item, index) => {
            return(
            <React.Fragment key={index}>
              <div className={classes.toolbar} />
              <div>
                <TextField 
                  label="nameOfScence" 
                  value={item.nameOfScence}
                  onChange={(e) => {change(e, 'nameOfScence', index)}}
                />
              </div>
              <div>
                <TextField 
                  value={item.longitude} 
                  label="longitude"
                  onChange={(e) => {change(e, 'longitude', index)}}
                />
                <TextField 
                  value={item.latitude} 
                  label="latitude"
                  onChange={(e) => {change(e, 'latitude', index)}}
                />
              </div>
              <div>
                <TextField
                  value={item.des}
                  multiline 
                  label="des"
                  onChange={(e) => {change(e, 'des', index)}}
                />
              </div>
              <div>
                <TextField 
                  multiline 
                  label="picURL"
                  value={item.picURL}
                  onChange={(e) => {change(e, 'picURL', index)}}
                />
              </div>
              <TextField 
                value={item.pointOrNot}
                label="pointOrNot" 
                onChange={(e) => {change(e, 'pointOrNot', index)}}
              />
              <TextField 
                value={item.category}
                label="category"
                onChange={(e) => {change(e, 'category', index)}}
              />
              <div>
                <TextField 
                  value={item.contructor}
                  label="contructor" 
                  onChange={(e) => {change(e, 'contructor', index)}}
                />
              </div>
              <div className={classes.btn}>
                <Button 
                  color="secondary" 
                  variant="contained"
                  onClick={() => removeItem(index)}
                >
                {`删除第${selectedIndex + 1}天第${index + 1}个景点`}
                </Button>
              </div>
              <Divider />
            </React.Fragment>
          )})
          : data.domestic === 1 ?
          <MapComponent 
            data={data.detail[selectedIndex]}
            totalData={data.detail}
            removeItem={removeItem}
            AddOneItem={AddOneItem}
            selectedIndex={selectedIndex}
            changePlan={changePlan}
          />
          :<GoogleMapComponent
            data={data.detail[selectedIndex]}
            totalData={data.detail}
            removeItem={removeItem}
            AddOneItem={AddOneItem}
            selectedIndex={selectedIndex}
            changePlan={changePlan}
          />
        }     
        </main>
      </React.Fragment>
      :null
      }
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default connect(
  function mapStateToProps(state) {
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch };
  }
)(ResponsiveDrawer);