import React from 'react';
import './../App.css';
import 'react-table/react-table.css';
import RoboclawStatus from './RoboclawStatus.js'

class Roboclaw extends React.Component {
   
    render() {
      return (
          <RoboclawStatus number={this.props.number} temp={this.props.temp}
            curr1={this.props.curr1} curr2={this.props.curr2}  error={this.props.error}
              
            />
           
      );
    }
  }
  
  export default Roboclaw;
  