import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class ExplanationDialog extends Component {

  render() {
    const {isOpen, onCloseClick} = this.props
    const actions = [
      <FlatButton label="Close" primary={true} onTouchTap={onCloseClick} />,
    ];
    return (
      <Dialog
          title="Explanation" actions={actions} modal={true} open={isOpen}
          autoScrollBodyContent={true}>
        <h3>This is an experiment to create the most exciting week anyone has ever had.</h3>
        <ul style={{marginTop: 15}}>
          <li style={{marginBottom: 8}}>14 hours per day can be filled with activities, 8 hours are reserved for sleeping.</li>
          <li style={{marginBottom: 8}}>Consider preparation times for an event.</li>
          <li style={{marginBottom: 8}}>All events have to be in, or close to, Berlin.</li>
          <li style={{marginBottom: 8}}>All events should be free or cheap, I'd like to cap it at 30 Euros a day.</li>
          <li style={{marginBottom: 8}}>You can edit other people’s events and that’s even desired, but please communicate your suggestion with the creator.</li>
          <li style={{marginBottom: 8}}>Please pick activities that I normally wouldn’t do.</li>
          <li style={{marginBottom: 8}}>The maximum length of an activity is limited to 6 hours.</li>
        </ul>
      </Dialog>
    );
  }
}
