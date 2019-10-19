import React from 'react';
import './../App.css';
import ROSLIB from 'roslib';
import ReactTable from 'react-table';
import selectTableHOC from 'react-table/lib/hoc/selectTable';
import 'react-table/react-table.css';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'; 

const SelectTable = selectTableHOC(ReactTable); 

class NodeDetail extends React.Component {
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
  