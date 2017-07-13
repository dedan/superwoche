import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import moment from 'moment'
import Avatar from 'material-ui/Avatar';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Sun from 'material-ui/svg-icons/image/wb-sunny';
import Moon from 'material-ui/svg-icons/image/brightness-3';

export default class EventDialog extends Component {

  state = {}

  componentWillReceiveProps(nextProps, oldProps) {
    if (nextProps.selectedEventId && nextProps.selectedEventId !== oldProps.selectedEventId) {
      const localEvent = {
        title: '',
        start: null,
        end: null,
        desc: '',
        type: 'wake',
        ...nextProps.events[nextProps.selectedEventId],
      }
      this.setState(localEvent)
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
    const {desc, title, start, end, user, type} = this.state
    const style = {
      display: 'flex',
      flexDirection: 'column',
      padding: '0 30px',
    }
    if (!(start && end)) {
      return <div></div>
    }
    const lengthInMinutes = (end - start) / (60 * 1000)
    const actions = <div style={{display: 'flex'}}>
      <FlatButton
          label="Delete"
          onTouchTap={() => onDeleteEventClick(selectedEventId)} />
      <div style={{flex: 1}} />
      <FlatButton label="Close" primary={false} onTouchTap={onCloseClick} />
      <FlatButton label="Save" primary={true} onTouchTap={this.handleSaveClick} />
    </div>
    const titleComp = <div style={{display: 'flex', alignItems: 'center'}}>
      <Avatar src={user.photoURL} />&nbsp;
      Event by&nbsp;<a href={`http://facebook.com/${user.uid}`} target="_blank">
        {user.displayName}
      </a>
    </div>

    return (
      <Dialog
          bodyStyle={style}
          title={titleComp}
          actions={actions}
          modal={true}
          open={isOpen}
          autoScrollBodyContent={true}>
        <TextField
            fullWidth={true}
            floatingLabelText="Title"
            value={title}
            autoFocus
            onChange={e => this.setState({title: e.target.value})} />
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <TextField
              style={{width: '30%'}}
              floatingLabelText="Start"
              disabled={true}
              value={moment(start).format('dddd hh:mm a')} />
          <SelectField
              style={{width: '30%'}}
              floatingLabelText="Duration"
              value={lengthInMinutes}
              onChange={this.handleLengthChange} >
            {Array.from({length: 12}, (value, key) => (key + 1) * 30).map(duration => {
              return <MenuItem key={duration} value={duration} primaryText={`${duration / 60} h`} />
            })}
          </SelectField>
          <RadioButtonGroup
              name="activityType" defaultSelected="wake"
              valueSelected={type}
              onChange={(event, value) => this.setState({type: value})} >
            <RadioButton
              value="wake"
              label="Activity"
              checkedIcon={<Sun style={{color: '#F44336'}} />}
              uncheckedIcon={<Sun />}
              style={{marginBottom: 8, marginRight: 15}} />
            <RadioButton
              value="sleep"
              label="Sleep"
              checkedIcon={<Moon style={{color: '#F44336'}} />}
              uncheckedIcon={<Moon />}
              style={{marginRight: 15}} />
          </RadioButtonGroup>
        </div>
        <TextField
            fullWidth={true}
            hintText="Please add detailed information for this event"
            floatingLabelText="Description"
            multiLine={true}
            rows={3}
            rowsMax={4}
            value={desc}
            underlineShow={false}
            onChange={e => this.setState({desc: e.target.value})} />
      </Dialog>
    );
  }
}

