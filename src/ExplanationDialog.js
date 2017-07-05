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
      <Dialog title="Explanation" actions={actions} modal={true} open={isOpen}>
        An Explanation what this experiment is all about.
      </Dialog>
    );
  }
}
