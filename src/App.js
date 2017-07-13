import React, { Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './App.css'
import MyCalendar from './MyCalendar'
import {Header, Teaser} from './Landing'
import {initializedFirebase, db, provider} from './FirebaseStore'
import {getTotalEventMinutesByType} from './validation'
import Sun from 'material-ui/svg-icons/image/wb-sunny';
import Moon from 'material-ui/svg-icons/image/brightness-3';

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
      <div style={{padding: 10}}>
        <Header
            user={user}
            onSignoutClick={this.handleSignout}
            onLoginClick={this.handleSignupLogin} />
        <div>
          {user ? <div>
              <MyCalendar
                  user={user}
                  appConfig={appConfig}
                  events={events}
                  onMoveEvent={this.handleMoveEvent}
                  onDeleteEventClick={this.handleDeleteEvent}
                  onSaveClick={this.handleSaveEvent}
                  onEventChange={this.handleEventChange} />
              <QuotaIndicator appConfig={appConfig} events={events} />
            </div> :
            <Teaser onLoginClick={this.handleSignupLogin} />}
          </div>
      </div>
    );
  }
}


class QuotaIndicator extends Component {

  render() {
    const {events, appConfig} = this.props
    const totalWakeDurationMinutes = getTotalEventMinutesByType(events, 'wake')
    const totalWakeRemainingHours = (appConfig.wakeQuotaMinutes - totalWakeDurationMinutes) / 60
    const totalSleepDurationMinutes = getTotalEventMinutesByType(events, 'sleep')
    const totalSleepRemainingHours = (appConfig.sleepQuotaMinutes - totalSleepDurationMinutes) / 60
    return (
      <div style={{marginTop: 15}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', flex: 1}}>
            <Sun />&nbsp;
            Wake time remaining {totalWakeRemainingHours} of {appConfig.wakeQuotaMinutes / 60} hours
          </div>
          <LinearProgress
              style={{flex: 1}}
              mode="determinate"
              value={totalWakeRemainingHours / appConfig.wakeQuotaMinutes * 60 * 100} />
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', flex: 1}}>
            <Moon />&nbsp;
            Sleep time remaining {totalSleepRemainingHours} of {appConfig.sleepQuotaMinutes / 60} hours
          </div>
          <LinearProgress
              style={{flex: 1}}
              mode="determinate"
              value={totalSleepRemainingHours / appConfig.sleepQuotaMinutes * 60 * 100} />
        </div>
      </div>
    )
  }
}


export default App;
