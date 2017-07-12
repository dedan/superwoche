import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'moment/locale/de'
import 'react-big-calendar/lib/css/react-big-calendar.css'


moment.locale('de')
BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const formats = {
  dayFormat: (date, culture, localizer) =>
    localizer.format(date, 'dd Do MMM', culture),
}

class MyCalendar extends Component {

  render() {
    const {events, onSelectEvent, onSelectSlot, onMoveEvent} = this.props
    return <DragAndDropCalendar
      selectable
      toolbar={false}
      events={events}
      defaultView='week'
      onEventDrop={onMoveEvent}
      startAccessor={event => new Date(event.start)}
      endAccessor={event => new Date(event.end)}
      defaultDate={new Date(2017, 7, 7)}
      onSelectEvent={event => onSelectEvent(event.id)}
      onSelectSlot={onSelectSlot}
      formats={formats}
    />
  }
}

export default DragDropContext(HTML5Backend)(MyCalendar)
