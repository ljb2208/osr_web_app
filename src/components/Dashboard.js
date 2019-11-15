import React from 'react';
import './../App.css';
import 'react-table/react-table.css'; 
import StatusTopic from './StatusTopic';
import RoverView from './RoverView';

const leftStyle = {
    float: 'left',
    width: '50%', 
    overflow: 'hidden'
};

const rightStyle = {
    float: 'left',
    width: '50%',
    overflow: 'hidden'
};

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: 0};
    }

    render()
    {
        return(
            <div id="wrapper">
            <div id="left" style={leftStyle}>
                <StatusTopic ROS={this.props.ROS} connected={this.props.connected} topicName="/status" />
            </div>
            <div id="right" style={rightStyle}>
                <RoverView width="330" height="500" id="roverview" ROS={this.props.ROS} connected={this.props.connected}/>
            </div>
            </div>
        );
    }
}

export default Dashboard;