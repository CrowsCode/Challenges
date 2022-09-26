import React,{useContext, useState} from 'react';
import firebase from 'firebase/app'
import 'firebase/auth';
import {Link} from 'react-router-dom'
import { Redirect } from 'react-router';

import {TextField, CssBaseline, Button, Avatar, Typography, makeStyles, Container, Grid, Box} from '@material-ui/core';
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

       
  function forgot(e){
      e.preventDefault()

      firebase.auth().sendPasswordResetEmail(email).then( () => {
          setEmail('')
          context_info.setSnackbar({message: 'verification email sent successfully', variant: 'success'})      
      }).catch( (error) => {
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
        <Typography component="h1" variant="h5"> Forgot</Typography>

        <form className={classes.form} noValidate  onSubmit={ (e) => forgot(e)} >
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
          
          <Button  type="submit"  fullWidth  variant="contained"  color="primary"  className={classes.submit}>Send Reset Email</Button>

          <Grid  container  direction="row"  justify="space-between"  alignItems="center" >
            <Grid item>
              <Link to="/Signin" ></Link>
            </Grid>
            <Grid item>
              <Link className={classes.link} to="/Signup" >{"Don't have an account? Sign Up"}</Link>
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