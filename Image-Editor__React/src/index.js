import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//import * as serviceWorker from './serviceWorker';
import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyC4g2BVh-LJ5qLbanq7PoI4Vc5uFu_NCD8",
  authDomain: "image-editor-1be76.firebaseapp.com",
  projectId: "image-editor-1be76",
  storageBucket: "image-editor-1be76.appspot.com",
  messagingSenderId: "591238877267",
  appId: "1:591238877267:web:593fabb567aca28e1cf6a6",
  measurementId: "G-C0SBWR9QN2"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
