import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/app'

firebase.initializeApp ({
  apiKey: "AIzaSyB2mxSS9jgFZmjVBrxJxeK-2Ucv_NDIByU",
  authDomain: "gonaorders.firebaseapp.com",
  projectId: "gonaorders",
  storageBucket: "gonaorders.appspot.com",
  messagingSenderId: "89807126249",
  appId: "1:89807126249:web:e60ab437c8bbcefb0d3a78",
  measurementId: "G-4FT5BW2ZDZ"
});

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
serviceWorker.register();