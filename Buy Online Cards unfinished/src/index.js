import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


import firebase from 'firebase/app'
 // Your web app's Firebase configuration 
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyDhs-6eU1yJ50u0DAGSj0VTmnpKRoYxTSc",
    authDomain: "brwa-106fc.firebaseapp.com",
    databaseURL: "https://brwa-106fc.firebaseio.com",
    projectId: "brwa-106fc",
    storageBucket: "brwa-106fc.appspot.com",
    messagingSenderId: "473639827170",
    appId: "1:473639827170:web:cf08d3592538e1ca4490bb",
    measurementId: "G-2S1104G4SH"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
