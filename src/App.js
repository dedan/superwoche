import React, { Component } from 'react';
import firebase from 'firebase'
import injectTapEventPlugin from 'react-tap-event-plugin';
import FlatButton from 'material-ui/FlatButton'

import MyCalendar from './MyCalendar'
import ExplanationDialog from './ExplanationDialog'
import EventDialog from './EventDialog'
import {validateEventChanges} from './validation'

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

  handleSelectSlot = slot => {
    const {events} = this.state
    const newEventId = db.ref('/events').push().key
    const newEvent = {
      id: newEventId,
      start: slot.start.valueOf(),
      end: slot.end.valueOf(),
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
                onSelectEvent={this.handleSelectEvent}
                onSelectSlot={this.handleSelectSlot} /> :
            <Teaser onLoginClick={this.handleSignupLogin} />}
          </div>
      </div>
    );
  }
}

class Header extends Component {

  state = {
    isExplanationDialogShown: false,
  }

  render() {
    const {user, onLoginClick, onSignoutClick} = this.props
    const {isExplanationDialogShown} = this.state
    const style = {
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      marginBottom: 20,
    }
    return (
      <div style={style}>
        <ExplanationDialog
            isOpen={isExplanationDialogShown}
            onCloseClick={() => this.setState({isExplanationDialogShown: false})} />

        <div>
          <h1>✨ Superwoche 3000 ✨</h1>
          <div>Help Stephan to have the most exciting week EVER</div>
        </div>
        <div style={{flex: 1}} />
        <FlatButton
            label="What is this? 🤔" primary={true}
            onTouchTap={() => this.setState({isExplanationDialogShown: true})} />
        <div style={{flex: 1}} />
        {user ?
          <FlatButton label="Logout" onTouchTap={onSignoutClick} /> :
          <FlatButton label="Login" onTouchTap={onLoginClick} />}
      </div>
    )
  }
}


class Teaser extends Component {

  render() {
    const {onLoginClick} = this.props
    const style = {
      width: '100%',
      height: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }
    return (
      <div style={style}>
        <FlatButton
            labelStyle={{color: "#FFF"}}
            backgroundColor="#3B5998"
            label="Login with Facebook"
            onTouchTap={onLoginClick} />
        <div style={{marginTop: 10, marginBottom: 30}}>... to let the magic happen</div>
        <img src={require('./excited.gif')} />
      </div>
    )
  }
}

export default App;
