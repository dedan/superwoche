import React, { Component } from 'react';
import MyCalendar from './MyCalendar'
import ExplanationDialog from './ExplanationDialog'
import firebase from 'firebase'

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

var config = {
  apiKey: "AIzaSyDZLKYT7Jek7nZ35uO_II5dLCamtakxJPA",
  authDomain: "friends-cal.firebaseapp.com",
  databaseURL: "https://friends-cal.firebaseio.com",
  projectId: "friends-cal",
  storageBucket: "friends-cal.appspot.com",
  messagingSenderId: "487333229953"
};
firebase.initializeApp(config);

var provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('public_profile');


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isExplanationDialogShown: false,
      isLoading: true,
    }
    firebase.auth().onAuthStateChanged(user => {
      this.setState({isLoading: false, user})
    });
  }

  handleSignupLogin = () => {
    firebase.auth().signInWithPopup(provider).then(function(result) {
      console.log('>>', 'logged in', result)
    }).catch(function(error) {
      console.log('>>', 'error', error)
    });
  }

  render() {
    const {isExplanationDialogShown, isLoading, user} = this.state
    if (isLoading) {
      return <div>loading...</div>
    }
    return (
      <div>
        <ExplanationDialog
            isOpen={isExplanationDialogShown}
            onCloseClick={() => this.setState({isExplanationDialogShown: false})} />
        {user ? <div>
          <button onClick={() => firebase.auth().signOut()}>logout</button>
          <button onClick={() => this.setState({isExplanationDialogShown: true})}>
            Explanation
          </button>
          <MyCalendar />
        </div> : <button onClick={this.handleSignupLogin}>please log in</button>}
      </div>
    );
  }
}

export default App;
