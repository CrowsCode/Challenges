import React,{useContext, useEffect, useState} from 'react';
import firebase from 'firebase/app'
import 'firebase/auth';
import PropTypes from 'prop-types';

import { useHistory } from "react-router-dom";
import { context} from  '../../App';

import InfoIcon from '@material-ui/icons/Info';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HistoryIcon from '@material-ui/icons/History';
import NotificationsIcon from '@material-ui/icons/Notifications';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import {makeStyles, useTheme, IconButton, Popper, MenuList, MenuItem, ClickAwayListener, Grow, Paper, Grid, Button, AppBar,
   CssBaseline, Divider, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton'   



const drawerWidth = 180;

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
  balance: {
    marginRight: '10%'
  },
  balance_name: {

  },
  balance_description: {

  },
}));

function ResponsiveDrawer(props) {
  let history = useHistory();//ama haman ishi 'Link' akat >> history.push('/forgot')
  const context_info = useContext(context)
 
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const container = window !== undefined ? () => window().document.body : undefined;
  const [openNotification, setOpenNotification] = useState(null);
  const [openProfile, setOpenProfile] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClickNotification = event => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };


  function logout(){
    firebase.auth().signOut().then( ()=> {  
      context_info.setSnackbar({message: 'Logged out successfully', variant: 'success'})
      history.push('/Signin')
    }).catch((error) => {
      context_info.setSnackbar({message: error.message, variant: 'error'})
    })
  }

  function darkModeChange(){
    props.themeStuff.set_isThemeLight(light => !light )
    firebase.database().ref(`users/${props.user.uid}/`).update({isThemeLight: !props.themeStuff.isThemeLight});  
  }
  

  const drawer_whenNotLoggedIn = (
    <List >
      <Grid container  direction="column"  justify="space-around"  alignItems="center"  >
        <Typography variant="h4" noWrap style={{margin: '1% 0'}}>
          Logo
        </Typography>
      </Grid>
     
      <List>
        {['About'].map((text, index) => (
            <ListItem button key={text} onClick={() => {history.push(`/${text}`)}}>            
                <ListItemIcon><InfoIcon/></ListItemIcon>
                <ListItemText primary={text} />
            </ListItem> 
        ))}
      </List>
    </List>
  );

  const drawer = (
    <List>
      <Grid container  direction="column"  justify="space-around"  alignItems="center"  >
        <Typography variant="h4" noWrap style={{margin: '1% 0'}}>
          Logo
        </Typography>
      </Grid>
      
      <List>
        {['Dashboard', 'About', 'History'].map((text, index) => (
          <ListItem button key={text} onClick={() => {history.push(`/${text}`)}}>
            <ListItemIcon>{index === 0 ? <DashboardIcon /> : index === 1 ? <InfoIcon /> : <HistoryIcon/>}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>

      <Divider  />

      <List>
        {['Account'].map((text, index) => (
          <ListItem button key={text} onClick={() => {history.push(`/${text}`)}}>
            <ListItemIcon><PersonIcon/></ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {['Logout'].map((text, index) => (
          <ListItem button key={text} onClick={logout}>
            <ListItemIcon><ExitToAppIcon/></ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </List>
  );
  const notificationsPropper = (
      <Popper  open={Boolean(openNotification)}  anchorEl={openNotification}  transition  disablePortal  >
        {({ TransitionProps, placement }) => (
          <Grow
          {...TransitionProps}
            id="profile-menu-list-grow"
            style={{  transformOrigin:  placement === "bottom" ? "center top" : "center bottom"  }}  >
            <Paper>
              <ClickAwayListener onClickAway={handleCloseNotification}>
                <MenuList role="menu">
                  <MenuItem  onClick={handleCloseNotification}  >
                    Mike John responded to your email
                  </MenuItem>
                  <MenuItem  onClick={handleCloseNotification}  >
                    You have 5 new tasks
                  </MenuItem>
                
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
          )}
      </Popper>
    )
  const DropdownPropper = (
    <Popper  open={Boolean(openProfile)}  anchorEl={openProfile}  transition  disablePortal  >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          id="profile-menu-list-grow"
          style={{  transformOrigin:  placement === "bottom" ? "center top" : "center bottom"  }}  >
          <Paper>
            <ClickAwayListener onClickAway={handleCloseProfile}>
              <MenuList role="menu">
                <MenuItem onClick={handleCloseProfile} onClick={() => {history.push('/Account')}} >
                  Add Balance
                </MenuItem>
                <Divider  />
                <MenuItem onClick={handleCloseProfile} onClick={darkModeChange} >
                  Dark mode   
                </MenuItem>
                <Divider  />
                <MenuItem onClick={handleCloseProfile} onClick={logout} >
                  Logout
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  )

  return (

    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>

          <Grid  container  direction="row"  alignItems="center"  >
              <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} className={classes.menuButton} >
                <MenuIcon />
              </IconButton>
          </Grid> 

          <Grid  container  direction="row"  justify="flex-end"  alignItems="center"  >
            {
              props.user === 'notNull'  ?
                <Skeleton  width='20%' height='5vh'   animation="wave"/>
            :
              props.user === null ? 
                <Button variant="outlined" color="secondary" onClick={() => {history.push('/Signin')}} >Sign in</Button>
            :
              <React.Fragment>
                {/*
                <Button onClick={handleClickNotification}  >
                  <Badge badgeContent={4} color="primary">
                    <NotificationsIcon />
                  </Badge>
                </Button>
                {notificationsPropper}        nnnnnnnnnooooooooooootttttttttttiiiiiifffffffffffiiiiiiiiiiccccccccccccccaaaaaatttttiiiiiiiooooooonnnnnn    
                */}
                <Button onClick={handleClickProfile} >
                  <div className={classes.balance}   >
                    <div className={classes.balance_name}>{props.user.displayName}</div>
                    <div className={classes.balance_description}>{props.balance}&nbsp;$</div>
                  </div>
                  <KeyboardArrowDownIcon  />
                </Button>
                {DropdownPropper}
              </React.Fragment>
            }
          </Grid> 
          
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
            {props.user !== null && props.user !== 'notNull'  ? drawer : drawer_whenNotLoggedIn}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer classes={{ paper: classes.drawerPaper, }} variant="permanent" open >
            {props.user !== null && props.user !== 'notNull' ? drawer : drawer_whenNotLoggedIn}
          </Drawer>
        </Hidden>
      </nav>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
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