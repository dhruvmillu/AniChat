// Import the functions you need from the SDKs you need
import * as firebase from 'firebase'
import 'firebase/app-check';
import { useRef } from 'react';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAHoMhDaxZBG9_sP_NXJap5HWRijnCIaIg",
  authDomain: "anichat-9cc48.firebaseapp.com",
  projectId: "anichat-9cc48",
  storageBucket: "anichat-9cc48.appspot.com",
  messagingSenderId: "626614683974",
  appId: "1:626614683974:web:2df1c9e02d3bfe2186bd47",
};

// Initialize Firebase

let app
if(firebase.apps.length===0){
    app = firebase.initializeApp(firebaseConfig)
    
}
else{
    app =firebase.app()
}





export {app}
export const auth = firebase.auth(app)
export const db = firebase.firestore(app)
export const storage = firebase.app().storage('gs://anichat-9cc48.appspot.com')
export {firebase}