import React from 'react';
import './../App.css';
import ROSLIB from 'roslib';
import Button from '@material-ui/core/Button';

class RunStop extends React.Component {
    constructor(props) {
      super(props);
      this.state = {run: false};
    }
  
    componentDidMount() {
      this.topic = new ROSLIB.Topic({ros: this.props.ROS, name: "/runstop",
            messageType: "osr_msgs/RunStop"});
    }
     
    onMessage(value) {
      this.setState({run: value.run});
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

    getText() {
      if (this.state.run)
        return "Stop";
      else
        return "Run";  
    }

    getColor() {
      if (this.state.run)
        return "secondary";
      else
        return "default";
    }

    handleClick = (e) => {
      console.log("runstop clicked");
      if (this.props.connected)
      {
        var val = false;

        if (!this.state.run)
          val = true;

        var msg = new ROSLIB.Message({
          run: val,
        });
        this.topic.publish(msg);
      }
    }

    
    render() {
      return (
          <div>
            <Button onClick={this.handleClick} variant="contained" color={this.getColor()} size="small">{this.getText()}</Button>
          </div>
      );
    }
  }
  
  export default RunStop;
  