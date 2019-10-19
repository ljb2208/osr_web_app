import React from 'react';
import './../App.css';
import ParamList from './ParamList';
import NodeList from './NodeList';
import Dashboard from './Dashboard';
import ROSLIB from 'roslib';
import 'react-table/react-table.css';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'; 

function TabPanel(props) {
    
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        <Box p={3}>{children}</Box>
      </Typography>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  
  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  }));


class DetailTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: 0};
    }

    
    handleChange = (event, newValue) => {
        this.setState({value: newValue});
        console.log(newValue);
    }

    render()
    {
        return(
            <div>
                <Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example">
                    <Tab label="Dashboard" {...a11yProps(0)} />
                    <Tab label="Nodes/Topics" {...a11yProps(1)} />
                    <Tab label="Parameters" {...a11yProps(2)} />
                </Tabs>
                <TabPanel value={this.state.value} index={0}>
                    <Dashboard connected={this.props.connected} ROS={this.props.ROS} />
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    <NodeList connected={this.props.connected} ROS={this.props.ROS} />
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                    <ParamList connected={this.props.connected} ROS={this.props.ROS} />
                </TabPanel>

            </div>
        );
    }
}

export default DetailTab;