import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/de'
import 'react-big-calendar/lib/css/react-big-calendar.css'


moment.locale('de')
BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);

const formats = {
  dayFormat: (date, culture, localizer) =>
    localizer.format(date, 'dd Do MMM', culture),
}

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
      defaultDate={new Date(2017, 7, 7)}
      onSelectEvent={event => onSelectEvent(event.id)}
      onSelectSlot={onSelectSlot}
      formats={formats}
    />
  }
}
