import './style.css';
import firebase from 'firebase/app';
import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import firebaseConfig from './FirebaseConfig';
import 'firebase/storage';

firebase.initializeApp(firebaseConfig);

ReactDom.render(<App/>,document.getElementById('root'));