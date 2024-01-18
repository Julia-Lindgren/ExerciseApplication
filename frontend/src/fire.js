import {initializeApp} from '@firebase/app';
import { getStorage } from '@firebase/storage';
import { getAuth } from '@firebase/auth';

//My Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDF-Mg0rYnSrTeIudDQyPYwjBTEJABCTNU",
    authDomain: "exerciseapplication-1.firebaseapp.com",
    projectId: "exerciseapplication-1",
    storageBucket: "exerciseapplication-1.appspot.com",
    messagingSenderId: "30904207333",
    appId: "1:30904207333:web:05837753cb57d9ba42d10c"
};

// Initialize the firebase app
let app;
try {
    initializeApp(firebaseConfig);
  } catch (err) {
    // console.log(err);
  }

// Get Firebase Authentication service
const auth = getAuth(app);
// Get Firebase Storage service
const storage = getStorage(app);

// Export the auth service 
export { auth, storage };