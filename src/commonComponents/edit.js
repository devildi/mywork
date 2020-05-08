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

import { mockData } from '../tools'

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
  }
}));

function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [data, setData] = React.useState(mockData);

  const change = (e, str, index) => {
    data.detail[selectedIndex].whereToGoThisDay[index][str] = e.target.value
    setData({...data})
  }

  const removeItem = (index) => {
    data.detail[selectedIndex].whereToGoThisDay.splice(index, 1)
    setData({...data})
  }

  const removeDay = (e, index) => {
    e.stopPropagation()
    data.detail.splice(index, 1)
    setData({...data})
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const submit = () => {

  }

  const addOneDay = () => {

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
      </div>
      <Divider />
      <List>
        <ListItem button onClick={addOneDay}>
          <ListItemIcon><AddIcon /></ListItemIcon>
        </ListItem>
        {data.detail.map((text, index) => (
          <ListItem 
            button 
            key={index} 
            selected={selectedIndex === index}
            onClick={() => {setSelectedIndex(index)}}
          >
            <ListItemText primary={'Day '+index}/>
            <ListItemIcon
              onClick={(e) => {removeDay(e, index)}}
            >
              <RemoveIcon />
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  return (
    <div className={classes.root}>
      <CssBaseline />
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
            地图数据编辑
          </Typography>
          <Button color="inherit" onClick={submit}>SAVE</Button>
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
      <main className={classes.content}>
      {
        data.detail[selectedIndex].whereToGoThisDay.map((item, index) => {
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
              DELETE
              </Button>
            </div>
            <Divider />
          </React.Fragment>
        )})
      }     
      </main>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;