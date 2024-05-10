'use client'

import { initializeApp } from 'firebase/app'
import { getDatabase, } from 'firebase/database'
import { getMessaging, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

// Replace with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAuJQbfImdHrxkra1ngxz338FOKDT8Wnl0",
    authDomain: "nexlabs-cbf78.firebaseapp.com",
    databaseURL: "https://nexlabs-cbf78-default-rtdb.firebaseio.com",
    projectId: "nexlabs-cbf78",
    storageBucket: "nexlabs-cbf78.appspot.com",
    messagingSenderId: "710716401593",
    appId: "1:710716401593:web:870a162281fa9c6affb868",
    measurementId: "G-2SSPGDYC7G"
};

const app = initializeApp(firebaseConfig);


const messaging = getMessaging(app)

// Handle messages received when the app is in the background
onMessage(messaging, (payload)) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'Background Message Title';
  const notificationOptions = {
    body: payload.notification?.body || 'Background Message body.',
    icon: '/firebase-logo.png', // Replace with your icon path
    // Add other notification options as needed
  };

  //self.registration.showNotification(notificationTitle, notificationOptions);
});