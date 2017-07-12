import React, { Component } from 'react';
import firebase from 'firebase'
import injectTapEventPlugin from 'react-tap-event-plugin';

import './App.css'
import MyCalendar from './MyCalendar'
import EventDialog from './EventDialog'
import {validateEventChanges} from './validation'
import {Header, Teaser} from './Landing'

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

const appConfig = {
  wakeQuotaMinutes: 7 * 14 * 60,
  sleepQuotaMinutes: 7 * 8 * 60,
  breakMinutes: 30,
}


class App extends Component {

  state = {
    events: {},
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

  handleSaveEvent = (eventId, newEventData) => {
    db.ref(`/events/${eventId}`).update(newEventData)
    this.setState({selectedEventId: null})
  }

  handleMoveEvent = ({event, start, end}) => {
    const {events} = this.state
    const updatedEvent = {
      ...event,
      start: start.valueOf(),
      end: end.valueOf(),
    }
    const errors = validateEventChanges(updatedEvent, events, appConfig)
    if (errors.length) {
      alert(errors.join('\n'))
    } else {
      db.ref(`/events/${updatedEvent.id}`).update(updatedEvent)
    }
  }

  handleSelectSlot = slot => {
    const {events, user} = this.state
    const newEventId = db.ref('/events').push().key
    const newEvent = {
      id: newEventId,
      start: slot.start.valueOf(),
      end: slot.end.valueOf(),
      user: user.providerData[0],
    }
    const errors = validateEventChanges(newEvent, events, appConfig)
    if (errors.length) {
      alert(errors.join('\n'))
    } else {
      db.ref(`/events/${newEventId}`).update(newEvent)
      this.handleSelectEvent(newEventId)
    }
  }

  render() {
    const {events, isLoading, user, selectedEventId} = this.state
    if (isLoading) {
      return <div>loading...</div>
    }
    return (
      <div>
        <EventDialog
            isOpen={!!selectedEventId}
            events={events}
            selectedEventId={selectedEventId}
            onDeleteEventClick={this.handleDeleteEvent}
            onSaveClick={this.handleSaveEvent}
            onCloseClick={() => this.setState({selectedEventId: null})} />
        <Header
            user={user}
            onSignoutClick={() => firebase.auth().signOut()}
            onLoginClick={this.handleSignupLogin} />
        <div>
          {user ?
            <MyCalendar
                events={Object.values(events)}
                onMoveEvent={this.handleMoveEvent}
                onSelectEvent={this.handleSelectEvent}
                onSelectSlot={this.handleSelectSlot} /> :
            <Teaser onLoginClick={this.handleSignupLogin} />}
          </div>
      </div>
    );
  }
}


export default App;
