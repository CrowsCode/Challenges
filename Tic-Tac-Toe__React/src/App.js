import React,{useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import firebase from 'firebase/app'
import 'firebase/auth';
import './components/styles/base.scss'

import Game from './components/game/GameScipts';

import NavBar from './components/nav/Nav'
import Home from './components/about-home/Home'
import About from './components/about-home//About'

import Login from './components/login-signUp/Login'
import SignUp from './components/login-signUp/Signup'
import Forgot from './components/login-signUp/Forgot'

import Profile from './components/profile/Profile'
import UserProfile from './components/profile/UserProfile'

import History from './components/history-leaderboard/History';
import LeaderBoard from './components/history-leaderboard/LeaderBoard';

import Settings from './components/others/Settings'
import GenericNotFound from './components/others/GenericNotFound'




function App() {

  const [user, setUser] = useState('notNull')//authListener needes a little time to request server and return user or null
  

  function authListener(){   //aw error 403 ya ba hoi amoya chana hawlm ya bom chak nakra
    firebase.auth().onAuthStateChanged( (firebaseUSer) => {
      if(firebaseUSer){    console.log('user logged in');  setUser(firebaseUSer);  } //agar null nabe awa if aka ish aka //console.log('already logged in');
      else{ console.log('user not logged in'); setUser(null)  }//console.log('User isn\'t logged in');
    })
  }
 
  useEffect( ()=>{ 
    console.log('Listening')
    authListener()
  },[])



  return (
    <Router>
      <div className="App">
      <NavBar user={user}/>

      {/* <Hint user={user}/> */}

      <Switch>

        <Route path='/' exact component={() => <Home user={user}/>}/>

        <Route path='/about' exact component={About}/>
 
        <Route path='/play' component={() => <Game user={user}/>}/>
        {/* <Route path='/Play' component={() => <Game title={`Props through component`} />}/> */}
     
        
        <Route path='/login' exact component={() => <Login user={user}/>}/>
        <Route path='/signUp' exact component={() => <SignUp user={user}/>}/>
        <Route path='/forgot' exact component={() => <Forgot user={user}/>}/>

        {/* <Route path='/Profile' exact component={() => <Profile user={user}/>}/>
        <Route path='/Profile/:user' exact component={() => <UserProfile user={user}/>}/> */}
      
        <Route path='/profile' exact component={() => <Profile user={user}/>}/>
        <Route path='/profile/:user' exact component={UserProfile} />  {/* exact aka bo awaya bo nmuna agar dwia user aka '/' hat awa wari nagret */}
      
        <Route path='/settings' exact component={() => <Settings user={user}/>}/>
        <Route path='/history' exact component={() => <History user={user}/>}/>
        <Route path='/leaderBoard' exact component={() => <LeaderBoard user={user}/>}/>

        <Route path="*"  render={(props) => <GenericNotFound {...props}/>}/>
        
      </Switch>

      </div>
    </Router>
  );
}

export default App;






/*
Firebase Auth on the Web
const auth = firebase.auth()
auth.signInWithEmailAndPassword(email, pass)
auth.createUserWithEmailAndPassword(ema il, pass)
auth.onAuthStateChanged(firebaseUSer => {} )//parameteraka null abe ka la logged in bo logout brwa//wa zanyari usrr abe agar la log out bo login brwa



install firebase
Manage USers >> https://firebase.google.com/docs/auth/web/manage-users?authuser=0
------------------
(1)In React
npm install firebase --save //save aka wai le aka dwai install la dependency bnusre
am code'ai xwaro la index.js
import * as firebase from "firebase";

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCzqAaDS1WDH5phWb9V9kj6PxaH9dk51js",
    authDomain: "game-922fc.firebaseapp.com",
    databaseURL: "https://game-922fc.firebaseio.com",
    projectId: "game-922fc",
    storageBucket: "game-922fc.appspot.com",
    messagingSenderId: "85804177142",
    appId: "1:85804177142:web:641faa7eb15906981d7ed7",
    measurementId: "G-10P4KGV74K"
  };
  firebase.initializeApp(firebaseConfig);

  (2)In normal web
  linkekyan haya la head'i html'aka da anre
  wa code'akai saro la file'i javascript'aka da anre u tawaw

  Install firebase UI

  React >> https://github.com/firebase/firebaseui-web-react
  Normal web >> https://github.com/firebase/firebaseui-web#react-dom-setup
*/

/*
Router

https://www.youtube.com/watch?v=Law7wfdg_ls   best vid >>dynamic routing ish aka bas 7aif github i nabu 

npm install react-router-dom

as >> la kati import atwani blleyi bo muna BrowserRouter as Router. Router yan har naweki ka barazui xomana variableka ka BrowserRouteraka refernce aka
BrowserRouter >> warp all components that you want to have the route factionality within

ROUTE REDIRECT 
https://dev.to/projectescape/programmatic-navigation-in-react-3p1l

*/

/*
Understanding Asynchronous JavaScript
Linkaka zor bqawataa
https://blog.bitsrc.io/understanding-asynchronous-javascript-the-event-loop-74cd408419ff

-----------------------------------------------------------------------
The await keyword

The real advantage of async functions becomes apparent when you combine it with the await keyword — in fact, await only works inside async functions. This can be put in front of any async promise-based function to pause your code on that line until the promise fulfills, then return the resulting value. In the meantime, other code that may be waiting for a chance to execute gets to do so.

You can use await when calling any function that returns a Promise, including web API functions.

Here is a trivial example:

async function hello() {
  return greeting = await Promise.resolve("Hello");
};

hello().then(alert);
-----------------------------------------------------------------------
AWAIT

The await operator is used to wait for a Promise. It can only be used inside an async function.
Syntax
  [rv] = await expression;
expression
  A Promise or any value to wait for.
rv
  Returns the fulfilled value of the promise, or the value itself if it's not a Promise.

Description
  The await expression causes async function execution to pause until a Promise is settled (that is, fulfilled or rejected), and to resume execution of the async function after fulfillment. When resumed, the value of the await expression is that of the fulfilled Promise.

  If the Promise is rejected, the await expression throws the rejected value.

  If the value of the expression following the await operator is not a Promise, it's converted to a resolved Promise.

  An await can split execution flow, allowing the caller of the await's function to resume execution before the deferred continuation of the await's function. After the await defers the continuation of its function, if this is the first await executed by the function, immediate execution also continues by returning to the function's caller a pending Promise for the completion of the await's function and resuming execution of that caller.

*/