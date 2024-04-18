'use client'

import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
	apiKey: 'AIzaSyAuJQbfImdHrxkra1ngxz338FOKDT8Wnl0',
	authDomain: 'nexlabs-cbf78.firebaseapp.com',
	databaseURL: 'https://nexlabs-cbf78-default-rtdb.firebaseio.com',
	projectId: 'nexlabs-cbf78',
	storageBucket: 'nexlabs-cbf78.appspot.com',
	messagingSenderId: '710716401593',
	appId: '1:710716401593:web:870a162281fa9c6affb868',
	measurementId: 'G-2SSPGDYC7G'
}

let analytics;
const app = initializeApp(firebaseConfig);
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export const database = getDatabase(app);
export const analytic = analytics;

// ------------------------------------------------------------------------

// const firebaseConfig = {
//     apiKey: "AIzaSyDNb61L6Szyo_KJut37GzQBZp53emG0kc8",
//     authDomain: "nexusers.firebaseapp.com",
//     databaseURL: "https://nexusers-default-rtdb.firebaseio.com",
//     projectId: "nexusers",
//     storageBucket: "nexusers.appspot.com",
//     messagingSenderId: "870835422218",
//     appId: "1:870835422218:web:ed540c343d1421faf04bf3",
//     measurementId: "G-SVQ9MFW4JN"
//     // measurementId: "G-SVQ9MFW4JN"
//     // measurementId: "G-NS20Y9N6S5"
//   };

//   const app = initializeApp(firebaseConfig);
//   export const database = getDatabase(app);

// ------------------------------------------------------------------------

// Check if Firebase Analytics is supported before initializing
// if (getAnalytics.isSupported()) {
//   export const analytics = getAnalytics(app);
// } else {
//   console.warn("Firebase Analytics is not supported in this environment.");
//   export const analytics = null;
// }

// import { initializeApp } from 'firebase/app';
// import { getDatabase } from 'firebase/database';
// import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: "AIzaSyDNb61L6Szyo_KJut37GzQBZp53emG0kc8",
//   authDomain: "nexusers.firebaseapp.com",
//   databaseURL: "https://nexusers-default-rtdb.firebaseio.com",
//   projectId: "nexusers",
//   storageBucket: "nexusers.appspot.com",
//   messagingSenderId: "870835422218",
//   appId: "1:870835422218:web:ed540c343d1421faf04bf3",
//   measurementId: "G-SVQ9MFW4JN"
//   // measurementId: "G-NS20Y9N6S5"
// };

// const app = initializeApp(firebaseConfig);
// export const database = getDatabase(app);
// export const analytics = getAnalytics(app);
