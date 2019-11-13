import React from 'react';
import './../App.css';
import PropTypes from 'prop-types';
import ROSLIB from 'roslib';
import ReactTable from 'react-table';
import selectTableHOC from 'react-table/lib/hoc/selectTable';
import 'react-table/react-table.css';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'; 
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import Gauge from 'react-svg-gauge';
import { getDiffieHellman } from 'crypto';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 1),
  },
}));


function getIdName(idType, id) {
  return idType + id;
};

function RoboclawStatus(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
    <Typography component="h6">
      Roboclaw {props.number}
    </Typography>
    <Gauge id="temp" width="100" height="80" label="Temperature" value={props.temp} min="0" max="500" />
    <Gauge id="amps1" width="100" height="80" label="Amps 1" value={props.curr1} min="0" max="150" />
    <Gauge id="amps2" width="100" height="80" label="Amps 2" value={props.curr2} min="0" max="150" />
  </Paper>
  );
}




class Roboclaw extends React.Component {
   
    
    constructor(props) {
      super(props);
    }    

    getIdName(idType)
    {
      return idType + this.props.number;
    }
    
    render() {
      const { classes } = this.props;
      return (
          <RoboclawStatus number={this.props.number} temp={this.props.temp}
            curr1={this.props.curr1} curr2={this.props.curr2} 
              tempID={this.getIdName("temp")}
            />
           
      );
    }
  }
  
  export default Roboclaw;
  