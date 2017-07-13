import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyDZLKYT7Jek7nZ35uO_II5dLCamtakxJPA",
  authDomain: "friends-cal.firebaseapp.com",
  databaseURL: "https://friends-cal.firebaseio.com",
  projectId: "friends-cal",
  storageBucket: "friends-cal.appspot.com",
  messagingSenderId: "487333229953"
};
export const initializedFirebase = firebase.initializeApp(config);
export const provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('public_profile');

export const db = firebase.database()
