import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment'
window.moment = moment

export default class EventDialog extends Component {

  state = {
    localEvent: null,
  }

  componentWillReceiveProps(nextProps, oldProps) {
    if (nextProps.selectedEventId && nextProps.selectedEventId !== oldProps.selectedEventId) {
      this.setState({localEvent: {...nextProps.events[nextProps.selectedEventId]}})
    }
  }

  handleLengthChange = (event, index, value) => {
    const {localEvent} = this.state
    localEvent.end = localEvent.start + value * 60 * 1000
    this.setState({localEvent})
  }

  render() {
    const {isOpen, onCloseClick, onDeleteEventClick, onSaveClick, selectedEventId} = this.props
    const {localEvent} = this.state
    let lengthInMinutes
    if (localEvent) {
      lengthInMinutes = (localEvent.end - localEvent.start) / (60 * 1000)
    }
    const actions = [
      <FlatButton label="Close" primary={false} onTouchTap={onCloseClick} />,
      <FlatButton label="Save" primary={true} onTouchTap={() => onSaveClick} />,
    ];
    return (
      <Dialog title="Edit event" actions={actions} modal={true} open={isOpen}>
        {localEvent ? <div>
          <div>from: {new Date(localEvent.start).toLocaleString()}</div>
          <div>end: {new Date(localEvent.end).toLocaleString()}</div>
          <br />
          <SelectField
            floatingLabelText="Length"
            value={lengthInMinutes}
            onChange={this.handleLengthChange} >
            {Array.from({length: 12}, (value, key) => (key + 1) * 30).map(duration => {
              return <MenuItem value={duration} primaryText={`${duration / 60} h`} />
            })}
          </SelectField>
          <FlatButton
              label="Delete"
              onTouchTap={() => onDeleteEventClick(selectedEventId)} />
        </div> : <div>empty</div>}
      </Dialog>
    );
  }
}

