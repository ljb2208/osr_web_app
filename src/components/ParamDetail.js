import React from 'react';
import './../App.css';
import ROSLIB from 'roslib';
import 'react-table/react-table.css';

import TextField from '@material-ui/core/TextField'; 



class ParamDetail extends React.Component {
    constructor(props) {
      super(props);
      this.state = {paramValue: ""};
    }
  
    componentDidMount() {
      console.log("ParamDetail: " + this.props.paramName);
      this.param = new ROSLIB.Param({ros: this.props.ROS, name: this.props.paramName});
  
      this.tick();
        
      this.timerID = setInterval(
        () => this.tick(),
        5000
      );
    }
  
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
  
    tick()
    {
      if (this.props.connected)
        this.param.get(this.onParamValue.bind(this));
    }
  
    onParamValue(value) {
      this.setState({paramValue: value});
    }
  
    handleTextChange(value) {
  
    }
  
    render() {
      return (
          <TextField
            id={this.props.paramName}
            label={this.props.paramName}
            //className={classes.textField}
            value={this.state.paramValue}
            onChange={this.handleTextChange}
            margin="dense"
            variant="outlined"
          />
      );
    }
  }
  
  export default ParamDetail;
  