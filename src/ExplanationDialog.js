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
        <ul>
          <li>Please pick activities that I usually wouldn't do.</li>
          <li>Only 14 hours of a day can be filled up with activities.</li>
          <li>
            And 8 hours a day are reserved for sleeping, however you can tell me where to sleep!
            <span style={{color: '#ccc'}}> - tell me to pitch my tent in Humboldthain Park and I'll sleep there.</span>
          </li>
          <li>The maximal length of an event is limited to 8 hours.</li>
          <li>Each event links to the creators FB profile, in case you want to communicate with them.</li>
          <li>
            You can edit the events created by other people.
            <span style={{color: '#ccc'}}> This kind of collaboration is desired, maybe the creator was not aware of how long it would take me to reach the destination or the event has to be changed because of the weather. </span>
          </li>
          <li>
            Please consider preparation times for an event.
            <span style={{color: '#ccc'}}> If a concert starts at 8, you can make the event start at 7 if I still have to buy the tickets and it is quite far from the previous event.</span>
          </li>
          <li>It is ok if some of the events cost some money, but please consider that I'm currently unemployed and on a tight budget. I won't mind getting invited for anything though ;-)</li>
        </ul>
      </Dialog>
    );
  }
}
