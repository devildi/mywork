import React, { useRef }  from 'react';
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
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Link from '@material-ui/core/Link';
import Gaode from './gaodeShow';
import Google from './googleShow';

import clsx from 'clsx';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import{
  setPointIndex,
} from '../store/action'
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

function ResponsiveDrawer({window, trip, dispatch, location, pointIndex}) {
  
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  
  const [data] = React.useState(trip || location.params)

  const [open] = React.useState(false)//模式

  const gaodeRef = useRef()
  const googleRef = useRef()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const clickPoint = (data, item) => {
    let obj = data?.detail.flat(Infinity).map((item1, index) => ({ item1, index })).filter(({ item1 }) => item1.nameOfScence === item.nameOfScence)
    dispatch(setPointIndex(obj[0].index))
    if (gaodeRef.current && data.domestic === 1) {
      gaodeRef.current.choosePoint(obj[0].index)
    } else if (googleRef.current && data.domestic === 0){
      googleRef.current.choosePoint(obj[0].index)
    }
  }

  const drawer = (
    <div>
      {/* 在 Drawer 内部添加 AppBar */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6">行程信息如下：</Typography>
        </Toolbar>
      </AppBar>
      
      <Divider />
      
      {/* 可折叠列表 */}
      <List>
        {data?.detail?.map((day, dayIndex) => (
          <React.Fragment key={dayIndex}>
            <ListItem 
              button 
              onClick={() => setSelectedIndex(dayIndex)}
              selected={selectedIndex === dayIndex}
            >
              <ListItemText primary={`第 ${dayIndex + 1} 天`} />
              {selectedIndex === dayIndex ? (
                <ExpandLess style={{ marginRight: 8 }} />
              ) : (
                <ExpandMore style={{ marginRight: 8 }} />
              )}
            </ListItem>
            {/* 可折叠的子项列表 */}
            <Collapse in={selectedIndex === dayIndex} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {day.map((item, itemIndex) => (
                  <ListItem 
                    key={itemIndex} 
                    button 
                    sx={{ pl: 4 }}
                    onClick={() => clickPoint(data, item)}
                  >
                    <ListItemText primary={item.nameOfScence} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  //console.log(data.detail[selectedIndex])
  const mapData = data.detail.flat(Infinity)
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
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant={ "temporary"} 
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
         data.domestic === 1 
         ?<Gaode 
            data={mapData}
            totalData={data.detail}
            ref={gaodeRef}
            pointIndex={pointIndex}
          />
          :<Google
            data={mapData}
            totalData={data.detail}
            ref={googleRef}
            pointIndex={pointIndex}
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