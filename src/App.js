import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './App.css'
import MyCalendar from './MyCalendar'
import {Header, Teaser} from './Landing'
import {initializedFirebase, db, provider} from './FirebaseStore'

injectTapEventPlugin();


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
    initializedFirebase.auth().onAuthStateChanged(user => {
      this.setState({isLoading: false, user})
    });
    db.ref('/events').on('value', snapshot => {
      this.setState({events: snapshot.val()  || {}})
    })
  }

  handleSignupLogin = () => {
    initializedFirebase.auth().signInWithPopup(provider)
  }

  handleSignout = () => {
    initializedFirebase.auth().signOut()
  }

  handleDeleteEvent = eventId => {
    db.ref(`/events/${eventId}`).remove()
  }

  handleSaveEvent = (eventId, newEventData) => {
    db.ref(`/events/${eventId}`).update(newEventData)
  }

  handleEventChange = (newEventId, newEvent) => {
    db.ref(`/events/${newEventId}`).update(newEvent)
  }

  render() {
    const {events, isLoading, user} = this.state
    if (isLoading) {
      return <div>loading...</div>
    }
    return (
      <div>
        <Header
            user={user}
            onSignoutClick={this.handleSignout}
            onLoginClick={this.handleSignupLogin} />
        <div>
          {user ?
            <MyCalendar
                user={user}
                appConfig={appConfig}
                events={events}
                onMoveEvent={this.handleMoveEvent}
                onDeleteEventClick={this.handleDeleteEvent}
                onSaveClick={this.handleSaveEvent}
                onEventChange={this.handleEventChange} /> :
            <Teaser onLoginClick={this.handleSignupLogin} />}
          </div>
      </div>
    );
  }
}


export default App;
