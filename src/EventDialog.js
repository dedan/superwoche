import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Sun from 'material-ui/svg-icons/image/wb-sunny';
import Moon from 'material-ui/svg-icons/image/brightness-3';
import Delete from 'material-ui/svg-icons/action/delete'

export default class EventDialog extends Component {

  state = {}

  componentWillReceiveProps(nextProps, oldProps) {
    if (nextProps.selectedEventId && nextProps.selectedEventId !== oldProps.selectedEventId) {
      const localEvent = {
        title: '',
        start: null,
        desc: '',
        type: 'wake',
        ...nextProps.events[nextProps.selectedEventId],
      }
      this.setState(localEvent)
    }
  }

  handleLengthChange = (event, index, value) => {
    this.setState({durationMinutes: value})
  }

  handleSaveClick = () => {
    const {onSaveClick, selectedEventId} = this.props
    const {title, desc, durationMinutes, type} = this.state
    if (!title.length) {
      this.setState({titleErrorMessage: 'Title canot be empty'})
      return
    }
    if (title.length > 50) {
      this.setState({titleErrorMessage: 'Maximum length is 50 characters'})
      return
    }
    onSaveClick && onSaveClick(selectedEventId, {title, desc, durationMinutes, type})
  }

  handleDeleteEventClick = eventId => {
    const {onDeleteEventClick} = this.props
    if (window.confirm('Do you really really want to delete this event?')) {
      onDeleteEventClick(eventId)
    }
  }

  render() {
    const {isOpen, onCloseClick, selectedEventId} = this.props
    const {desc, title, start, durationMinutes, user, type, titleErrorMessage} = this.state
    const style = {
      display: 'flex',
      flexDirection: 'column',
      padding: '0 30px',
    }
    if (!start) {
      return <div></div>
    }
    const actions = <div style={{display: 'flex'}}>
      <FlatButton
          label="Delete"
          icon={<Delete />}
          onTouchTap={() => this.handleDeleteEventClick(selectedEventId)} />
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
            errorText={titleErrorMessage}
            onChange={e => this.setState({title: e.target.value})} />
        <div style={{display: 'flex', alignItems: 'center'}}>
          <SelectField
              style={{width: '45%'}}
              floatingLabelText="Duration"
              value={durationMinutes}
              onChange={this.handleLengthChange} >
            {Array.from({length: 9}, (value, key) => (key + 1) * 60).map(duration => {
              return <MenuItem key={duration} value={duration} primaryText={`${duration / 60} h`} />
            })}
          </SelectField>
          <RadioButtonGroup
              name="activityType" defaultSelected="wake"
              valueSelected={type}
              style={{paddingLeft: 50, width: '45%'}}
              onChange={(event, value) => this.setState({type: value})} >
            <RadioButton
              value="wake"
              label="Activity Event"
              checkedIcon={<Sun style={{color: '#F44336'}} />}
              uncheckedIcon={<Sun />}
              style={{marginBottom: 8, marginRight: 15}} />
            <RadioButton
              value="sleep"
              label="Sleepy Time"
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

