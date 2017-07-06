import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class EventDialog extends Component {

  state = {
    localEvent: null,
  }

  componentWillReceiveProps(nextProps, oldProps) {
    if (nextProps.selectedEventId && nextProps.selectedEventId !== oldProps.selectedEventId) {
      this.setState({localEvent: {...nextProps.events[nextProps.selectedEventId]}})
    }
  }

  render() {
    const {isOpen, onCloseClick, onDeleteEventClick, onSaveClick, selectedEventId} = this.props
    const {localEvent} = this.state
    const actions = [
      <FlatButton label="Close" primary={false} onTouchTap={onCloseClick} />,
      <FlatButton label="Save" primary={true} onTouchTap={() => onSaveClick} />,
    ];
    return (
      <Dialog title="Edit event" actions={actions} modal={true} open={isOpen}>
        {localEvent ? <div>
          <div>from: {localEvent.start}</div>
          <div>to: {localEvent.end}</div>
          <FlatButton
              label="Delete"
              onTouchTap={() => onDeleteEventClick(selectedEventId)} />
        </div> : <div>empty</div>}
      </Dialog>
    );
  }
}
