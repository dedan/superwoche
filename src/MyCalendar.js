import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);


export default class MyCalendar extends Component {

  render() {
    const {events, onSelectEvent, onSelectSlot} = this.props
    return <BigCalendar
      selectable
      toolbar={false}
      events={events}
      defaultView='week'
      startAccessor={event => new Date(event.start)}
      endAccessor={event => new Date(event.end)}
      scrollToTime={new Date(1970, 1, 1, 6)}
      defaultDate={new Date(2015, 3, 12)}
      onSelectEvent={event => onSelectEvent(event.id)}
      onSelectSlot={onSelectSlot}
    />
  }
}
