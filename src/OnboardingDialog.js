import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ReactTooltip from 'react-tooltip'
import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper';

const TooltipIcon = ({id}) => (
  <a data-tip data-for={id}>
    <ActionInfo style={{width: 16, height: 16, verticalAlign: 'text-top'}} />
  </a>
)


export default class OnboardingDialog extends Component {

  state = {
    stepIndex: 0,
  };

  renderStepActions(step) {
    return (
      <div style={{margin: '12px 0'}}>
        <FlatButton
          label="Next"
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={() => this.setState({stepIndex: this.state.stepIndex + 1})}
          style={{marginRight: 12}}
        />
      </div>
    );
  }

  render() {
    const {isOpen, user, onCloseClick} = this.props
    const {stepIndex} = this.state
    const actions = [
      <RaisedButton disabled={stepIndex !== 3} label="Let's go" primary={true} onTouchTap={onCloseClick} />,
    ];
    return (
      <Dialog
          title={`Ahoi ${user.displayName}`} actions={actions} modal={true} open={isOpen}
          autoScrollBodyContent={true}>
        <Stepper activeStep={stepIndex} orientation="vertical">
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 0})}>
              Welcome
            </StepButton>
            <StepContent>
              <p>
                Thanks for participating in my little experiment to have the most
                unconventional, social and exciting week ever. Please help me by
                filling this calendar with interesting activities, either for me alone
                if you are not in town, but preferably together with you! The ideal
                activity is one that brings something totally novel and memorable to
                my life.
              </p>
              {this.renderStepActions(0)}
            </StepContent>
          </Step>
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 1})}>
              Details
            </StepButton>
            <StepContent>
              <ReactTooltip id="sleep">
                <span>For example you could tell me to pitch my tent at Tiergarten</span>
              </ReactTooltip>
              <ReactTooltip id="prep">
                <span>
                  If you want me to see a theatre play at 8pm, <br />
                  consider that I have to get there and buy the tickets, <br />
                  so maybe better set the event to 7pm
                </span>
              </ReactTooltip>
              <p>
                In an effort to not totally wear me out over the course of the week,
                only 14 hours a day can be filled up with activities and 8 hours a
                day will be reserved for sleeping, although you can also tell me
                where to sleep&nbsp;<TooltipIcon id="sleep" />.
                To make the whole thing work, please consider preparation time for an
                event&nbsp;<TooltipIcon id="prep" />.
              </p>
              {this.renderStepActions(1)}
            </StepContent>
          </Step>
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 2})}>
              Communication
            </StepButton>
            <StepContent>
              <ReactTooltip id="com">
                <span>
                  Maybe the other person doesn’t know Berlin well and forgot <br />
                  to consider the time to travel there or you just have an idea <br />
                  of how to make this event even more exciting
                </span>
              </ReactTooltip>
              <p>
                I invited about 40 people to this experiment, so please don’t grab too much
                time on the calendar at first. If you have a few amazing ideas, please communicate
                them with others or check back after a week to see if there is still some
                free time available. You can edit events created by other
                people, but communicate with them first&nbsp;<TooltipIcon id="com" />.
                Each event links to the creators FB profile so you can easily reach out to them.
              </p>
              {this.renderStepActions(2)}
            </StepContent>
          </Step>
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 3})}>
              Budget
            </StepButton>
            <StepContent>
              <ReactTooltip id="budget">
                <span>
                  If the suite at Hotel Adlon is already paid for by you, <br />
                  I wouldn't mind sleeping there of course ;-)
                </span>
              </ReactTooltip>
              <p>
                When considering an event or activity, please pick things that you
                think I wouldn't usually do. Something new, something exciting, something challenging.
                Also, it is ok if some of the events cost some money, but please consider
                that I'm currently unemployed and on a tight budget&nbsp;<TooltipIcon id="budget" />.
              </p>
              <p>
                You can find a summary of these instructions in the top menu
              </p>
            </StepContent>
          </Step>
        </Stepper>
      </Dialog>
    );
  }
}
