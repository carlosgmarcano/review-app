import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDRE7H4GCPgwj4GpK40Ap83Oh6gdQfydAw",
    authDomain: "restaurants-review-14fc0.firebaseapp.com",
    databaseURL: "https://restaurants-review-14fc0.firebaseio.com",
    projectId: "restaurants-review-14fc0",
    storageBucket: "restaurants-review-14fc0.appspot.com",
    messagingSenderId: "757085775286",
    appId: "1:757085775286:web:df4275a231b8c2c7850d17"
}
export const firebaseApp = firebase.initializeApp(firebaseConfig);