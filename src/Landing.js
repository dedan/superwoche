import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton'
import ExplanationDialog from './ExplanationDialog'


export class Header extends Component {

  state = {
    isExplanationDialogShown: true,
  }

  render() {
    const {user, onLoginClick, onSignoutClick} = this.props
    const {isExplanationDialogShown} = this.state
    const style = {
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
    }
    const subtitleStyle = {
      textAlign: 'center',
      color: '#999',
      marginBottom: 15,
    }
    return (
      <div>
        <div style={style}>
          <ExplanationDialog
              isOpen={isExplanationDialogShown && !!user}
              onCloseClick={() => this.setState({isExplanationDialogShown: false})} />

          <div>
            <h1 style={{margin: '0.4em 0'}}>
              <span role="img" aria-label="sparkle">✨ </span>
              Superwoche 3000
              <span role="img" aria-label="sparkle"> ✨</span>
            </h1>
          </div>
          <div style={{flex: 1}} />
          {user ? <FlatButton
              label="Explanation!" primary={true}
              onTouchTap={() => this.setState({isExplanationDialogShown: true})} /> : null}
          <div style={{flex: 1}} />
          {user ?
            <FlatButton label="Logout" onTouchTap={onSignoutClick} /> :
            <FlatButton label="Login" onTouchTap={onLoginClick} />}
        </div>
        <div style={subtitleStyle}>Help Stephan to have the most exciting week EVER</div>
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
        <img alt="excited" src={require('./excited.gif')} />
      </div>
    )
  }
}
