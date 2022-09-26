import React,{useEffect, useState} from 'react';

import Nav from './components/nav/Nav';
import Dashboard from './components/dashboard/Dashboard';
import Account from './components/account/Account';
import About from './components/about/About';
import History from './components/history/History';

import Signin from './components/auth/Signin';
import Signup from './components/auth/Signup';
import Forgot from './components/auth/Forgot';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import firebase from 'firebase/app'
import 'firebase/auth';
import { SnackbarProvider, useSnackbar } from 'notistack';

import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

export  const context = React.createContext();


const themeLight = {
  palette: {
    type: 'light',
    // primary: {
    //   main: purple[500],
    // },
    // secondary: {
    //   main: green[500],
    // },
  }, typography: { 
    useNextVariants: true//errorek la aba deprecated 
 }
};

const themeDark = {
  palette: {
    type: 'dark',
    // primary: {
    //   main: purple[500],
    // },
    // secondary: {
    //   main: green[500],
    // },
  }, typography: { 
    useNextVariants: true
 }
};


function App() {
  
  const [isThemeLight, set_isThemeLight] = useState(false)
  const [balance, set_balance] = useState(0)
  const [user, setUser] = useState('notNull')//authListener needes a little time to request server and return user or null
  

  




  function authListener(){ 
    firebase.auth().onAuthStateChanged( (firebaseUSer) => {
      if(firebaseUSer){  
       setUser(firebaseUSer);  
       firebase.database().ref(`users/${firebaseUSer.uid}`).on('value', (snapshot) => { 
          const user_obj = snapshot.val()
            set_balance( user_obj.balance )
            set_isThemeLight( user_obj.isThemeLight )
       })
      } // already logged in
      else{  setUser(null) }// User isn't logged in
    })
  }
  useEffect( ()=>{
    authListener()
  },[]) 



  //snackbar stuff
  const { enqueueSnackbar } = useSnackbar(); // function akaya ka message akani pe anerdre
  const [ snackbar, setSnackbar] = useState({message: 'Getting everything ready', variant: 'info'})
  const providerValue = React.useMemo(() => ({// NOTE 'CONTEXT' la xwaro
  snackbar, setSnackbar
  }), [snackbar]);
  useEffect(() => { 
    let variant = snackbar.variant // variant could be success, error, warning, info, or default
    if(variant === 'none'){
      enqueueSnackbar(snackbar.message);
    }else{
      enqueueSnackbar(snackbar.message , { variant });
    }
  }, [providerValue])
  //snackbar stuff


  return (
    <ThemeProvider theme={isThemeLight ? createMuiTheme(themeLight) : createMuiTheme(themeDark)}>   {/* createMuiTheme har jari danayak drust akat */}


      <context.Provider value={providerValue}>
 
        <Router>
          <Switch>
            <Nav user={user} themeStuff={{isThemeLight, set_isThemeLight}}  balance={balance}>
      
              <Route path='/' exact component={() => <About user={user}/>}/>
              <Route path='/Dashboard' exact component={() => <Dashboard user={user} balanceStuff={{balance: balance, set_balance: set_balance}}/>}/>
              <Route path='/About' exact component={() => <About user={user}/>}/>
              <Route path='/History' exact component={() => <History user={user}/>}/>
            
              <Route path='/Signin' exact component={() => <Signin user={user}/>}/>
        
              <Route path='/Signup' exact component={() => <Signup user={user}/>}/>
              <Route path='/Forgot' exact component={() => <Forgot user={user}/>}/>

              <Route path='/Account' exact component={() => <Account  balance={balance} user={user}/>}/>
            </Nav>
          </Switch>
        </Router>   
      </context.Provider>
    </ThemeProvider>
  );
}

export default function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={3}>
      <App />
    </SnackbarProvider>
  );
}


/*
========================================================================================================
NOTE 'CONTEXT'
To pass in multiple state values to a provider, you just need to create another state object and pass it in.

But inlining these comes with a caveat mentioned in the docs. Since the object (and arrays) in render are created every render, they lose the referential equality and hance any components connected to this context will need to refresh.

To get around this in a functional component, you can use useMemo to memoise the value and refresh only when one of these values change.

const MyContext = React.createContext();
const MyProvider = (props) => {
    const [valueA, setValueA] = React.useState("foo");
    const [valueB, setValueB] = React.useState("bar");
    const providerValue = React.useMemo(() => ({
        valueA, setValueA,
        valueB, setValueB,
    }), [valueA, valueB]);
    return(
        <MyContext.Provider value={providerValue}>
            {props.children}
        </MyContext.Provider>
    );
}
========================================================================================================


========================================================================================================



========================================================================================================



========================================================================================================


========================================================================================================
*/