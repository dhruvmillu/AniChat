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
