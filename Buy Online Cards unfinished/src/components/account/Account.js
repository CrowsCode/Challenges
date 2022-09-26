import React,{useState, useEffect, useContext} from 'react'

import { Paper, ListSubheader, ListItem, List, ListItemText, makeStyles, Container, Grid, Button, TextField, Typography, Accordion, AccordionSummary, AccordionDetails, AccordionActions } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import firebase from 'firebase/app'
import 'firebase/auth';



import { Redirect } from 'react-router';

import Skeleton from '@material-ui/lab/Skeleton'


import { context} from  '../../App';





const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));


const sellyWebsite_URL = "https://kurdcr.selly.store/product/06c37429"


export default function ControlledAccordions(props) {

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [openTab, set_openTab] = useState('addBalanceTab')
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const context_info = useContext(context)

  //new wata taza u ishta save nakrawa, current awai estaya ka abe user enter i ka , display awai estaya u user natwane daskari ka la regai input
  const [newPassword, set_newPassword] = useState('')
  const [newEmail, set_newEmail] = useState('')

  const [currentPassword, set_currentPassword] = useState('')
  const [currentEmail, set_currentEmail] = useState('')

  const [deleteAccount, set_deleteAccount] = useState(false)
  const [newUsername, set_newUsername] = useState('')

  const [code, setCode] = useState('')



  function isOnline(){
      //navigator.onLine will return the status whether it is online or offline but it wont check internet connectivity is there or not
      let condition = navigator.onLine ? 'online' : 'offline';
      if (condition === 'online') {
          fetch('https://www.google.com/', { // Check for internet connectivity
              mode: 'no-cors',
  })    .then(() => {    return true    }).catch(() => {   return false    }  )//false >> INTERNET CONNECTIVITY ISSUE
      }else{
         return false
      }
  }
  
  function updateAccountSettings(e, type){
    e.preventDefault()
    if(isOnline() === false){ context_info.setSnackbar({message: "Couldn't detect internet connection", variant: 'error'});  return;  }

    if(type === 'username'){
      if(newUsername.length < 3){ context_info.setSnackbar({message: "Username should be greater or equal to 3 characters", variant: 'error'});  return;  }
      else if(newUsername.length > 9){  context_info.setSnackbar({message: "Username should be less than 10 characters", variant: 'error'});  return; }

      let username_capitalFirst = newUsername.toLowerCase()
      username_capitalFirst = username_capitalFirst.charAt(0).toUpperCase() + username_capitalFirst.slice(1)

      firebase.database().ref(`allNameAndUIDs/`).once('value').then( async (snapshot) => {
        let allNamesObject = snapshot.val() 
        allNamesObject = allNamesObject === null ? {} : allNamesObject
        let allNamesArray = Object.keys(allNamesObject)

        if(!allNamesArray.includes(username_capitalFirst)){
          await props.user.updateProfile({    displayName: username_capitalFirst    }).then(() => {   }).catch((error) => {     });//Couldn\'t update user profile(name)
          firebase.database().ref(`users/${props.user.uid}/userInfo/`).update({username: username_capitalFirst }); 

          for(let i=0; i< allNamesArray.length; i++){
            if(allNamesObject[allNamesArray[i]] === props.user.uid){  delete allNamesObject[allNamesArray[i]];   break;  }
          }
          allNamesObject[username_capitalFirst] = props.user.uid
          firebase.database().ref('/').update({allNameAndUIDs: allNamesObject }); 
        
          context_info.setSnackbar({message: 'Username updated successfully', variant: 'success'})
        }else{    
          context_info.setSnackbar({message: "Username isn't unique", variant: 'error'})
        }
      }) 
  }else{
      const user = firebase.auth().currentUser;
      const credential = firebase.auth.EmailAuthProvider.credential(currentEmail, currentPassword);

      user.reauthenticateWithCredential(credential).then( async () => {//`Account re-authenticated sucessfuly`
        if(type === 'email'){
          await user.updateEmail(newEmail).then( () => {
            set_newEmail(''); set_currentPassword(''); set_currentEmail('')
            context_info.setSnackbar({message: 'Email updated successfully', variant: 'success'})
          }).catch( (error) => {
            context_info.setSnackbar({message: error.message, variant: 'error'})//email failed
          });
        }else if(type === 'password'){
          //var newPassword = getASecureRandomPassword();
          await user.updatePassword(newPassword).then( () => {
            set_newPassword('');  set_currentPassword('');  set_currentEmail('')
            context_info.setSnackbar({message: 'Password updated successfully', variant: 'success'})
          }).catch( (error) => {
            context_info.setSnackbar({message: error.message, variant: 'error'})//password failed
          });
        }else if(type === 'delete'){
          await user.delete().then( () => {
            set_currentPassword(''); set_currentEmail('')
            context_info.setSnackbar({message: 'Account deleted successfully', variant: 'success'})
          }).catch( (error) => {
            context_info.setSnackbar({message: error.message, variant: 'error'})//delete failed
          });
        }
      }).catch( (error) => {
        context_info.setSnackbar({message: error.message, variant: 'error'})//reauthenticateWithCredential failed
      });
    }
  }

  function redeemCode(e){
    e.preventDefault()
    if(code.length === 0){  context_info.setSnackbar({message: "Enter your code", variant: 'error'});  return;  }

    let ref = firebase.database().ref(`codes/${code}`)
    ref.once('value').then( (snapshot) => {   
      if(snapshot.exists()){
        let giftcardBalance = parseInt( snapshot.val() )
        firebase.database().ref(`users/${props.user.uid}/balance`).once('value').then( (snap) => {   
          if(snapshot.exists()){
            let userBalance = parseInt( snap.val() )
            userBalance += giftcardBalance
            firebase.database().ref(`users/${props.user.uid}/`).update(  {balance: userBalance})
            ref.remove()

            const currentUserCodesRef = firebase.firestore().collection('users').doc(props.user.uid).collection('codes').doc(code)
            const batch = firebase.firestore().batch();
            batch.set(currentUserCodesRef, {balance:giftcardBalance},{merge:true});
            batch.commit()
            context_info.setSnackbar({message: `${giftcardBalance} got added to your balance`, variant: 'success'})
          }  
        }).catch()
      }else{ context_info.setSnackbar({message: "Code does not exist", variant: 'error'}) }
    }).catch()
  }
  

    
  const nameJSX = (
    <form  onSubmit={(e) =>{   updateAccountSettings(e, 'username')}} id="form-settings">
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary  expandIcon={<ExpandMoreIcon />}  aria-controls="panel1bh-content"  id="panel1bh-header"  >
          <Typography className={classes.heading}>Username</Typography>
          <Typography className={classes.secondaryHeading}>{props.user === null || props.user === 'notNull' ? '' : props.user.displayName }</Typography>
        </AccordionSummary>
        <AccordionActions>
          <Grid container spacing={3}>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    id="outlined-required"
                    label="New Username"
                    variant="outlined"
                    value={newUsername} onChange={ (e) => set_newUsername(e.target.value) }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button color="secondary" fullWidth type="submit" variant="contained" >save</Button> 
            </Grid>

          </Grid>
        </AccordionActions>
      </Accordion>
    </form>
  ) 

  const emailJSX = (
    <form  onSubmit={(e) =>{  updateAccountSettings(e, 'email')}} id="form-settings">
    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
      <AccordionSummary  expandIcon={<ExpandMoreIcon />}  aria-controls="panel2bh-content"  id="panel2bh-header"  >
        <Typography className={classes.heading}>Email</Typography>
        <Typography className={classes.secondaryHeading}>{props.user === null || props.user === 'notNull' ? '' : props.user.email }</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={3}>

          <Grid item xs={12}>
            <Grid container spacing={2}>
    
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="New Email"             
                  variant="outlined"
                  value={newEmail} onChange={ (e) => set_newEmail(e.target.value) }
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Current Email"
                  // defaultValue="show current email" //current email 
                  variant="outlined"

                  value={currentEmail} onChange={ (e) => set_currentEmail(e.target.value) }
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Current Password"
                  variant="outlined"

                  value={currentPassword} onChange={ (e) => set_currentPassword(e.target.value) }
                />
              </Grid>

            </Grid>
          </Grid>
          
          <Grid item xs={12}>
            <Button color="secondary" fullWidth type="submit" variant="contained">save</Button>
          </Grid>

        </Grid>
      </AccordionDetails>
    </Accordion>
  </form>
  )

  const passwordJSX = (
    <form  onSubmit={(e) =>{ updateAccountSettings(e, 'password')}} id="form-settings">
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary  expandIcon={<ExpandMoreIcon />}  aria-controls="panel3bh-content"  id="panel3bh-header"  >
          <Typography className={classes.heading}>Password</Typography>
          <Typography className={classes.secondaryHeading}>Change Password</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>

            <Grid item xs={12}>
              <Grid container spacing={2}>
      
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    id="outlined-required"
                    label="New Password"             
                    variant="outlined"

                    value={newPassword} onChange={ (e) => set_newPassword(e.target.value) }
                  />
              </Grid>

              <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    id="outlined-required"
                    label="Current Email"
                    // defaultValue="show current email" //current email 
                    variant="outlined"

                    value={currentEmail} onChange={ (e) => set_currentEmail(e.target.value) }
                  />
              </Grid>

              <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    id="outlined-required"
                    label="Current Password"
                    variant="outlined"

                    value={currentPassword} onChange={ (e) => set_currentPassword(e.target.value) }
                  />
                </Grid>

              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button color="secondary" fullWidth type="submit" variant="contained">save</Button>  
            </Grid>

          </Grid>
        </AccordionDetails>
      </Accordion>
    </form>
  )


  const addBalanceTab = (
    <Paper elevation={3} variant="outlined"  >
      <List
        subheader={
          <Grid container direction="row" justify="space-between" alignItems="center">
            <ListSubheader component="div" id="nested-list-subheader" >Add Balance</ListSubheader>
            <ListSubheader component="div" id="nested-list-subheader" >Current Balance: {props.balance}&nbsp;$</ListSubheader>
          </Grid> 
        }
        style={{paddingBottom: '0'}}
      >
        <form  onSubmit={(e) =>{ redeemCode(e)}} id="form-settings">
          <Container>
            <Grid container spacing={5} direction="row"  justify="center"  alignItems="center">

              <Grid container spacing={2} item xs={12} lg={6} >
                <Grid item xs={12}>
                  <TextField m id="standard-basic" label="Code" fullWidth variant="filled"  value={code} onChange={ (e) => setCode(e.target.value)} />
                </Grid>

                <Grid item xs={12}>
                  <Button  color="primary" fullWidth type="submit" variant="contained">Redeem Code</Button>  
                </Grid>
              </Grid>
              
              <Grid item  item xs={6} lg={3} container  direction="row"  justify="center"  alignItems="center">    
                  <Button color="secondary" fullWidth type="submit" variant="contained"  href={sellyWebsite_URL} target="_blank" >
                    Buy Giftcard
                  </Button>        
              </Grid>
      
            </Grid>
          </Container>
        </form>
      </List>
    </Paper>
  )
  const generalTab = (
    <Paper elevation={3} variant="outlined"  >
      <List
        subheader={ <ListSubheader component="div" id="nested-list-subheader" >General</ListSubheader>  }
        style={{paddingBottom: '0'}}
      >
        {nameJSX}
        {emailJSX}
      </List>
    </Paper>
  )
  const secuirtyTab = (
    <Paper elevation={3} variant="outlined"  >
      <List
        subheader={ <ListSubheader component="div" id="nested-list-subheader" >Secuirty </ListSubheader>  }
        style={{paddingBottom: '0'}}
      >   
        {passwordJSX}
      </List>
    </Paper>
  )
  const notificationsTab = (
    <Paper elevation={3} variant="outlined"  >
      <List
        subheader={ <ListSubheader component="div" id="nested-list-subheader" >Notifications</ListSubheader> }
        style={{paddingBottom: '0'}}
      >       
      </List>
    </Paper>
  )


  if(props.user === null){ 
    return (<Redirect  to="/Signin" />)
  }else if(props.user !== null){ 
    return (
      <div className={classes.root}>
        <Grid container spacing={5}>
  
          <Grid  item xs='12' sm='6' md='4' lg='3' xl='3' >
            {
              props.user === 'notNull' ?
              <Skeleton  width='100%' height='250px'   animation="wave"/>
            :
              <Paper elevation={1}  >
                <List
                  subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                      Account
                    </ListSubheader>
                  }
                >
                  <ListItem button onClick={() =>  {set_openTab('addBalanceTab')} }>
                    <ListItemText primary="Add Balance" secondary={null}/>
                  </ListItem>
                  <ListItem button onClick={() =>  {set_openTab('General')} }>
                    <ListItemText primary="General Settings" secondary={null}/>
                  </ListItem>
                  <ListItem button onClick={() => {set_openTab('Secuirty')} }>
                    <ListItemText primary="Secuirty Settings" />
                  </ListItem>
                  {/* <ListItem button onClick={() => {set_openTab('Notifications')} }>
                    <ListItemText primary="Notifications" />
                  </ListItem>  nnnnnnnnnooooooooooootttttttttttiiiiiifffffffffffiiiiiiiiiiccccccccccccccaaaaaatttttiiiiiiiooooooonnnnnn
                  */}
                </List>
              </Paper>
            }
          </Grid>

          <Grid   item xs='12' sm='12' md='8' lg='9' xl='9' >
            {props.user === 'notNull' ? 
              <Skeleton  width='100%' height='250px'   animation="wave"/>
            :
              openTab === 'addBalanceTab' ? addBalanceTab 
            :
              openTab === 'General' ? generalTab 
            :
              openTab === 'Secuirty' ? secuirtyTab
            :
              openTab === 'Notifications' ? notificationsTab
            :
              '' 
            }
            {/* {openTab === 'Notifications' ? notificationsTab : ''}   nnnnnnnnnooooooooooootttttttttttiiiiiifffffffffffiiiiiiiiiiccccccccccccccaaaaaatttttiiiiiiiooooooonnnnnn  */}
          </Grid>

        </Grid>
      </div>
    );
  }
}