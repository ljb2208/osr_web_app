import React from 'react';
import './../App.css';
import Roboclaw from './Roboclaw.js';
import ROSLIB from 'roslib';
import Gauge2 from './Gauge.js';

class StatusTopic extends React.Component {
    constructor(props) {
      super(props);
      this.state = {batteryLevel: 0, rcError: [0, 0, 0, 0, 0], 
        rcTemp: [0,0,0,0,0], rcCurrent: [0,0,0,0,0,0,0,0,0,0]};
    }
  
    componentDidMount() {
      console.log("ParamDetail: " + this.props.paramName);
      this.topic = new ROSLIB.Topic({ros: this.props.ROS, name: this.props.topicName,
            messageType: "osr_msgs/Status"});
    }
     
    onMessage(value) {
      console.log("New message received " + value.battery);
      this.setState({batteryLevel: value.battery});
      this.setState({rcError: value.error_status});
      this.setState({rcTemp: value.temp});
      this.setState({rcCurrent: value.current})
    }

    componentDidUpdate(prevProps) {
      if (this.props.connected !== prevProps.connected)
      {
        if (this.props.connected) {
          this.topic.subscribe(this.onMessage.bind(this));
        } else {
          this.topic.unsubscribe();
        }
      }
    }
  
    
    render() {
      return (
          <div>
          <Gauge2 label="Battery Level" width="200" height="150" id="battery" value={this.state.batteryLevel} min="0" max="200" scale="10" valueWarn="155" valueCrit="150" />
          <Roboclaw number="1" error={this.state.rcError[0]} temp={this.state.rcTemp[0]} curr1={this.state.rcCurrent[0]} curr2={this.state.rcCurrent[1]}/>
          <Roboclaw number="2" error={this.state.rcError[1]} temp={this.state.rcTemp[1]} curr1={this.state.rcCurrent[2]} curr2={this.state.rcCurrent[3]} />
          <Roboclaw number="3" error={this.state.rcError[2]} temp={this.state.rcTemp[2]} curr1={this.state.rcCurrent[4]} curr2={this.state.rcCurrent[5]} />
          <Roboclaw number="4" error={this.state.rcError[3]} temp={this.state.rcTemp[3]} curr1={this.state.rcCurrent[6]} curr2={this.state.rcCurrent[7]} />
          <Roboclaw number="5" error={this.state.rcError[4]} temp={this.state.rcTemp[4]} curr1={this.state.rcCurrent[8]} curr2={this.state.rcCurrent[9]} />
         </div>
      );
    }
  }
  
  export default StatusTopic;
  