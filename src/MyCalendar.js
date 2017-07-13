import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import EventDialog from './EventDialog'
import moment from 'moment';
import {validateEventChanges} from './validation'


import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'moment/locale/de'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// TODO: Get rid of firebase dependency in this file.
import {db} from './FirebaseStore'

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

  state = {
    selectedEventId: null,
  }

  handleSelectEvent = eventId => {
    this.setState({selectedEventId: eventId})
  }

  handleDeleteEvent = eventId => {
    this.props.onDeleteEventClick(eventId)
    this.setState({selectedEventId: null})
  }

  handleSaveClick = (eventId, newEventData) => {
    this.props.onSaveClick(eventId, newEventData)
    this.setState({selectedEventId: null})
  }

  handleSelectSlot = slot => {
    const {appConfig, user, events} = this.props
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
      db.ref(`/events/${newEventId}`).remove()
    } else {
      this.props.onEventChange(newEventId, newEvent)
      this.handleSelectEvent(newEventId)
    }
  }

  handleMoveEvent = ({event, start, end}) => {
    const {appConfig, events} = this.props
    const updatedEvent = {
      ...event,
      start: start.valueOf(),
      end: end.valueOf(),
    }
    const errors = validateEventChanges(updatedEvent, events, appConfig)
    if (errors.length) {
      alert(errors.join('\n'))
    } else {
      this.props.onEventChange(updatedEvent.id, updatedEvent)
    }
  }


  render() {
    const {events} = this.props
    const {selectedEventId} = this.state
    return <div>
      <EventDialog
          isOpen={!!selectedEventId}
          events={events}
          selectedEventId={selectedEventId}
          onDeleteEventClick={this.handleDeleteEvent}
          onSaveClick={this.handleSaveClick}
          onCloseClick={() => this.setState({selectedEventId: null})} />
      <DragAndDropCalendar
          selectable
          toolbar={false}
          events={Object.values(events)}
          defaultView='week'
          onEventDrop={this.handleMoveEvent}
          startAccessor={event => new Date(event.start)}
          endAccessor={event => new Date(event.end)}
          defaultDate={new Date(2017, 7, 7)}
          onSelectEvent={event => this.handleSelectEvent(event.id)}
          onSelectSlot={this.handleSelectSlot}
          formats={formats} />
    </div>
  }
}

export default DragDropContext(HTML5Backend)(MyCalendar)
