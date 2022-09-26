import React,{useContext, useState} from 'react';
import firebase from 'firebase/app'
import 'firebase/auth';
import {Link} from 'react-router-dom'
import { Redirect } from 'react-router';
import {Grid, TextField, CssBaseline, Button, Avatar, makeStyles, Container, Typography, Box} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { context} from  '../../App';
import Loading from './Loading'

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    color: theme.palette.secondary.light,
  }
}));

export default function SigninComponent(props) {

  const classes = useStyles();
  const context_info = useContext(context)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')



  function signin(e) {
    e.preventDefault();
    
    firebase.auth().signInWithEmailAndPassword(email, password).then( (cred)=>{ 
      setPassword('')
      setEmail('')
      if(cred.user.emailVerified === false){
        context_info.setSnackbar({message: `Email isn't verified, verification email sent to ${cred.user.email}`, variant: 'error'})
        props.user.sendEmailVerification().then(function() {
          firebase.auth().signOut()
      }).catch( (error) => {   });
      }else{
        context_info.setSnackbar({message: 'Signed in successfully', variant: 'success'})
      }
    }).catch((error) => {
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
        <Typography component="h1" variant="h5">Sign in</Typography>

        <form className={classes.form} noValidate  onSubmit={ (e) => signin(e)} >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email} onChange={ (e) => setEmail(e.target.value) }
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"  
            type="password"
            id="password"
            autoComplete="current-password"
            value={password} onChange={ (e) => setPassword(e.target.value) }
          />

          <Button  type="submit"  fullWidth  variant="contained"  color="primary"  className={classes.submit}  >Sign In</Button>
          
          <Grid  container  direction="row"  justify="space-between"  alignItems="center" >
            <Grid item >
              <Link className={classes.link} to="/Forgot">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link className={classes.link} to="/Signup">{"Don't have an account? Sign Up"}</Link>
            </Grid>  
          </Grid>
   
        </form> 
      </div>

      
      

      {/* <Box mt={8}>
        <Copyright />
      </Box> */}

    </Container>
  );
        }
}