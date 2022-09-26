import React,{useState, useContext} from 'react'
import firebase from 'firebase/app'
import 'firebase';
import {Link} from 'react-router-dom'
import { Redirect } from 'react-router';


import {Grid, Typography, makeStyles, Container, Checkbox, FormControlLabel, TextField, CssBaseline, Button, Avatar} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';


import Loading from './Loading'
import { context} from  '../../App';

const defaultPhotoUrl = 'https://firebasestorage.googleapis.com/v0/b/brwa-106fc.appspot.com/o/photos%2Fdefault_profile_photo.png?alt=media&token=a7131198-5d30-4012-8522-e3152716f1b0'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    color: theme.palette.secondary.light,
  }
}));

export default function SignUpComponent(props) {
  const classes = useStyles();
  const context_info = useContext(context)

  const [username, set_username] = useState('')  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [receiveMails, set_receiveMails] = useState(false) 
 

  async function signup(e){
    e.preventDefault();

    if(username.length < 3){  context_info.setSnackbar({message: "Username should be 3 charecters at least ", variant: 'error'}); return;   }
    else if(username.length > 12){   context_info.setSnackbar({message: "Username should be less or equal to 12 charecters", variant: 'error'});  return;
    }else if(password.length < 6){   context_info.setSnackbar({message: "Password should be 6 charecters at least ", variant: 'error'});  return;  }

    let username_capitalFirst = username.toLowerCase()
    username_capitalFirst = username_capitalFirst.charAt(0).toUpperCase() + username_capitalFirst.slice(1)

    await firebase.database().ref(`allNameAndUIDs/`).once('value').then( (snapshot) => {
      let allNamesObject =    snapshot.val()  || {}
      allNamesObject = allNamesObject === null ? {} : allNamesObject
      let allNamesArray = Object.keys(allNamesObject) //Object.key()'akan nawakann >> wa Object.values() value akan aheneto ka lam 7alataman UID yakana
          
      if(!allNamesArray.includes(username_capitalFirst)){
        firebase.auth().createUserWithEmailAndPassword(email, password).then( cred =>{
          sendEmailVerification() 
          cred.user.updateProfile({
            displayName: username_capitalFirst,
            photoURL: defaultPhotoUrl
          }).then( async () => {
            let updates = {}
            updates['userInfo/username'] = username_capitalFirst 
            updates['userInfo/photoURL'] = defaultPhotoUrl;  
            updates['balance'] = 0;  
            updates['isThemeLight'] = false; 
            updates['receiveMails'] = receiveMails; 
            firebase.database().ref(`users/${cred.user.uid}/`).update(updates); 
            
            updates = {}
            updates[username_capitalFirst] = cred.user.uid;   
            firebase.database().ref('allNameAndUIDs/').update(updates); 

            context_info.setSnackbar({message: 'Account created successfully', variant: 'success'})
            firebase.auth().signOut()
          })       
        }).catch((error) => { 
          context_info.setSnackbar({message: error.message, variant: 'error'}) //createUserWithEmailAndPassword
        })
      }else{
        context_info.setSnackbar({message: "Username isn't unique", variant: 'error'})
      }
    })      
  }

  function sendEmailVerification(){
    firebase.auth().currentUser.sendEmailVerification().then( () => {
      context_info.setSnackbar({message: 'verification email sent successfully', variant: 'success'})
    }).catch(function(error) {
      context_info.setSnackbar({message: error.message, variant: 'error'})
    });
  }


  if(props.user === 'notNull'){ 
      return (<Loading  />)
  }else if(props.user !== null){ 
      return (<Redirect  to="/" />)
  }else if(props.user === null){
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Sign up</Typography>

        <form className={classes.form} noValidate  onSubmit={ (e) => signup(e)}>
          <Grid container spacing={2}>
          
            <Grid item xs={12}>
              <TextField
                autoComplete="fname"
                name="username"
                variant="outlined"
                required
                fullWidth
                id="Username"
                label="Username"
                autoFocus
                value={username} onChange={ (e) => set_username(e.target.value) }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email} onChange={ (e) => setEmail(e.target.value) }
                type='email'
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password} onChange={ (e) => setPassword(e.target.value) }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={receiveMails} onChange={() => {set_receiveMails(receiveMails => !receiveMails)}} value="allowExtraEmails" color="primary" />}
                label="I want to receive marketing promotions and updates via email."
              />
            </Grid>
          </Grid>

          <Button  type="submit"  fullWidth  variant="contained"  color="primary"  className={classes.submit}  >Sign Up</Button>

          <Grid  container  direction="row"  justify="space-between"  alignItems="center" >
            <Grid item>
              <Link className={classes.link} to="/Signin">Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </form>
      </div>

      {/* <Box mt={5}>
        <Copyright />
      </Box> */}

    </Container>
  );
}
}