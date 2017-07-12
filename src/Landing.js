import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton'
import ExplanationDialog from './ExplanationDialog'


export class Header extends Component {

  state = {
    isExplanationDialogShown: false,
  }

  render() {
    const {user, onLoginClick, onSignoutClick} = this.props
    const {isExplanationDialogShown} = this.state
    const style = {
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      marginBottom: 20,
    }
    return (
      <div style={style}>
        <ExplanationDialog
            isOpen={isExplanationDialogShown}
            onCloseClick={() => this.setState({isExplanationDialogShown: false})} />

        <div>
          <h1>✨ Superwoche 3000 ✨</h1>
          <div>Help Stephan to have the most exciting week EVER</div>
        </div>
        <div style={{flex: 1}} />
        <FlatButton
            label="What is this? 🤔" primary={true}
            onTouchTap={() => this.setState({isExplanationDialogShown: true})} />
        <div style={{flex: 1}} />
        {user ?
          <FlatButton label="Logout" onTouchTap={onSignoutClick} /> :
          <FlatButton label="Login" onTouchTap={onLoginClick} />}
      </div>
    )
  }
}


export class Teaser extends Component {

  render() {
    const {onLoginClick} = this.props
    const style = {
      width: '100%',
      height: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }
    return (
      <div style={style}>
        <FlatButton
            labelStyle={{color: "#FFF"}}
            backgroundColor="#3B5998"
            label="Login with Facebook"
            onTouchTap={onLoginClick} />
        <div style={{marginTop: 10, marginBottom: 30}}>... to let the magic happen</div>
        <img src={require('./excited.gif')} />
      </div>
    )
  }
}
