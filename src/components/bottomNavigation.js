import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ProfileIcon from '@material-ui/icons/AccountCircle';
import Badge from '@material-ui/core/Badge'

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    right: 0,
    bottom: 0,
    borderTop:'1px solid #A9A9A9',
  },
});

export default function Navigation(props) {
  const classes = useStyles();

  const { 
    whichPage,
    onSelect,
    nextstickerUsersIncreased
   } = props

  return (
    <BottomNavigation
      value={whichPage}
      onChange={(event, newValue) => {
        onSelect(newValue)
      }}
      className={classes.root}
    >
      <BottomNavigationAction icon={
        <Badge badgeContent={nextstickerUsersIncreased} color="secondary">
          <ProfileIcon />
        </Badge>
      } 
      />
      <BottomNavigationAction icon={<FavoriteIcon />} />
      <BottomNavigationAction icon={<RestoreIcon />} />
    </BottomNavigation>
  );
}