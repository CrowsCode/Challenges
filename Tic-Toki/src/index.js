import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app'
// import * as firebase from "firebase";

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCDKgZ3Zc62djUsEHNAmcawd5GKfU8oyw4",    
    authDomain: "baleno-c9fc8.firebaseapp.com",
    databaseURL: "https://baleno-c9fc8.firebaseio.com",
    projectId: "baleno-c9fc8",
    storageBucket: "baleno-c9fc8.appspot.com",
    messagingSenderId: "244672230555",
    appId: "1:244672230555:web:6904c3ec67cfa371a5423e",
    measurementId: "G-WZ452SJREE"
  };
  firebase.initializeApp(firebaseConfig);
 
  firebase.firestore().enablePersistence()
  .catch(function(err) {
      if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code === 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });
 
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>, 
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();


// if('serviceWorker' in navigator){
//   navigator.serviceWorker.register('/serviceWorker.js')
//     .then(reg => console.log('service worker registered'))
//     .catch(err => console.log('service worker not registered', err));
// }