import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import moment from 'moment'
window.moment = moment

export default class EventDialog extends Component {

  state = {}

  componentWillReceiveProps(nextProps, oldProps) {
    if (nextProps.selectedEventId && nextProps.selectedEventId !== oldProps.selectedEventId) {
      this.setState({...nextProps.events[nextProps.selectedEventId]})
    }
  }

  handleLengthChange = (event, index, value) => {
    const {start} = this.state
    this.setState({end: start + value * 60 * 1000})
  }

  handleSaveClick = () => {
    const {onSaveClick, selectedEventId} = this.props
    onSaveClick && onSaveClick(selectedEventId, this.state)
  }

  render() {
    const {isOpen, onCloseClick, onDeleteEventClick, selectedEventId} = this.props
    const {title, start, end} = this.state
    if (!(start && end)) {
      return <div></div>
    }
    const lengthInMinutes = (end - start) / (60 * 1000)
    const actions = [
      <FlatButton label="Close" primary={false} onTouchTap={onCloseClick} />,
      <FlatButton label="Save" primary={true} onTouchTap={this.handleSaveClick} />,
    ];
    return (
      <Dialog title="Edit event" actions={actions} modal={true} open={isOpen}>
        <TextField
            floatingLabelText="Title"
            value={title}
            onChange={e => this.setState({title: e.target.value})} />
        <br />
        <TextField
            floatingLabelText="Start"
            disabled={true}
            value={moment(start).format('dddd hh:mm a')} />
        <br />
        <SelectField
          floatingLabelText="Duration"
          value={lengthInMinutes}
          onChange={this.handleLengthChange} >
          {Array.from({length: 12}, (value, key) => (key + 1) * 30).map(duration => {
            return <MenuItem key={duration} value={duration} primaryText={`${duration / 60} h`} />
          })}
        </SelectField>
        <br />
        <FlatButton
            label="Delete"
            onTouchTap={() => onDeleteEventClick(selectedEventId)} />
      </Dialog>
    );
  }
}

