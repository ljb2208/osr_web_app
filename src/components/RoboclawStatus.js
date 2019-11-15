import React from 'react';
import './../App.css';
import 'react-table/react-table.css';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'; 
import { makeStyles } from '@material-ui/core/styles';
import Gauge2 from './Gauge.js';
import ErrorSharpIcon from '@material-ui/icons/ErrorSharp';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 1),
  },
}));

class RoboclawStatus extends React.Component {
    
    getColor(error) {
      if (error === 0)
        return "disabled";
      else
        return "error";
    };
    
    render() {
      return (
        <Paper className={useStyles.root}>
        <Typography component="h6">
          Roboclaw {this.props.number} 
          <ErrorSharpIcon color={this.getColor(this.props.error)} />
        </Typography>
        <Gauge2 id="temp" width="100" height="80" label="Temperature" value={this.props.temp} min="0" max="500" scale="10" valueWarn="35" valueCrit="40"/>
        <Gauge2 id="amps1" width="100" height="80" label="Amps 1" value={this.props.curr1} min="0" max="150" scale="10" valueWarn="10" valueCrit="15"/>
        <Gauge2 id="amps2" width="100" height="80" label="Amps 2" value={this.props.curr2} min="0" max="150" scale="10" valueWarn="10" valueCrit="15"/>
        </Paper>
      );
    }
  }
  
  export default RoboclawStatus;
  