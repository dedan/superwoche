import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);


export default class MyCalendar extends Component {
  state = {
    events: []
  }

  handleSelectSlot = slotInfo => {
    this.setState({
      events: [...this.state.events, {
        start: slotInfo.start,
        end: slotInfo.end
      }]
    })
  }

  render() {
    const {events} = this.state
    return <BigCalendar
      selectable
      toolbar={false}
      events={events}
      defaultView='week'
      scrollToTime={new Date(1970, 1, 1, 6)}
      defaultDate={new Date(2015, 3, 12)}
      onSelectEvent={event => alert(event.title)}
      onSelectSlot={this.handleSelectSlot}
    />
  }
}
