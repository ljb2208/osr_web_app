import React from 'react';
import './../App.css';
import ParamDetail from './ParamDetail';
import ROSLIB from 'roslib';
import ReactTable from 'react-table';
import selectTableHOC from 'react-table/lib/hoc/selectTable';
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

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: 0};
    }

    render()
    {
        return(
            <div>
                <ParamDetail ROS={this.props.ROS} connected={this.props.connected} paramName="/rosdistro" />

            </div>
        );
    }
}

export default Dashboard;