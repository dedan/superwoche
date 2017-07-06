import React, { Component } from 'react';
import MyCalendar from './MyCalendar'
import ExplanationDialog from './ExplanationDialog'
import EventDialog from './EventDialog'
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
const db = firebase.database()

var provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('public_profile');


class App extends Component {

  state = {
    events: {},
    isExplanationDialogShown: false,
    isLoading: true,
  }

  constructor(props) {
    super(props)
    firebase.auth().onAuthStateChanged(user => {
      this.setState({isLoading: false, user})
    });
    db.ref('/events').on('value', snapshot => {
      this.setState({events: snapshot.val()  || {}})
    })
  }

  handleSignupLogin = () => {
    firebase.auth().signInWithPopup(provider).then(function(result) {
      console.log('>>', 'logged in', result)
    }).catch(function(error) {
      console.log('>>', 'error', error)
    });
  }

  handleSelectEvent = eventId => {
    this.setState({selectedEventId: eventId})
  }

  handleDeleteEvent = eventId => {
    db.ref(`/events/${eventId}`).remove()
    this.setState({selectedEventId: null})
  }

  handleSelectSlot = slot => {
    const newEventId = db.ref('/events').push().key
    const newEvent = {
      id: newEventId,
      start: slot.start.valueOf(),
      end: slot.end.valueOf(),
    }
    db.ref(`/events/${newEventId}`).update(newEvent)
    this.handleSelectEvent(newEventId)
  }

  render() {
    const {events, isExplanationDialogShown, isLoading, user, selectedEventId} = this.state
    if (isLoading) {
      return <div>loading...</div>
    }
    return (
      <div>
        <ExplanationDialog
            isOpen={isExplanationDialogShown}
            onCloseClick={() => this.setState({isExplanationDialogShown: false})} />
        <EventDialog
            isOpen={!!selectedEventId}
            events={events}
            selectedEventId={selectedEventId}
            onDeleteEventClick={this.handleDeleteEvent}
            onCloseClick={() => this.setState({selectedEventId: null})} />
        {user ? <div>
          <button onClick={() => firebase.auth().signOut()}>logout</button>
          <button onClick={() => this.setState({isExplanationDialogShown: true})}>
            Explanation
          </button>
          <MyCalendar
              events={Object.values(events)}
              onSelectEvent={this.handleSelectEvent}
              onSelectSlot={this.handleSelectSlot} />
        </div> : <button onClick={this.handleSignupLogin}>please log in</button>}
      </div>
    );
  }
}

export default App;
