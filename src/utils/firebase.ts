import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDNb61L6Szyo_KJut37GzQBZp53emG0kc8",
  authDomain: "nexusers.firebaseapp.com",
  databaseURL: "https://nexusers-default-rtdb.firebaseio.com",
  projectId: "nexusers",
  storageBucket: "nexusers.appspot.com",
  messagingSenderId: "870835422218",
  appId: "1:870835422218:web:ed540c343d1421faf04bf3",
  measurementId: "G-SVQ9MFW4JN"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
