import React from 'react';
import './../App.css';
import ParamDetail from './ParamDetail';


class Other extends React.Component {
    render()
    {
        return(
            <ParamDetail ROS={this.props.ROS} connected={this.props.connected} paramName="/rosdistro" />
        );
    }
}

export default Other;