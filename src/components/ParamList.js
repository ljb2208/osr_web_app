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

  class ParamList extends React.Component {
    constructor(props) {
      super(props);    
      this.state = {paramList: [], 
                    selectedParams: [], 
                    currentParamIndex: -1,
                    currentSelectedParamIndex: -1, 
                    getAllParamValues: false};
    }

    componentDidUpdate(prevProps) {
      if (this.props.connected != prevProps.connected && this.props.connected)
        this.tick();
    }
  
    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        5000
      );
      this.tick();
    }
  
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
  
  
    onParamValue(value) {
      const list = this.state.paramList;
      list[this.state.currentParamIndex].paramValue = value;
      this.setState({paramList: list});
     
      if (this.state.getAllParamValues)
      {
        var param = this.getNextSelectedParam();
  
        if (param !== "")
          this.getParamValue(param);
      }
    }
  
    getNextSelectedParam()
    {
      if (this.state.currentSelectedParamIndex < (this.state.selectedParams.length - 1))
      {
        var newIndex = this.state.currentSelectedParamIndex + 1;
        this.setState({currentSelectedParamIndex: newIndex});
  
        for (var i=0; i < this.state.paramList.length; i++)
        {
          if (this.state.paramList[i].paramName === this.state.selectedParams[this.state.currentSelectedParamIndex])
          {
            this.setState({currentParamIndex: i});
            break;
          }
        }
        
        return this.state.selectedParams[this.state.currentSelectedParamIndex];
      }
      else
      {
        this.setState({getAllParamValues: false});
      }
  
      return "";
    }
  
    getParamValue(param) {
      var index = -1;
  
      for (var i=0; i < this.state.paramList.length; i++)
      {
        if (this.state.paramList[i].paramName === param)
        {
          index = i;
          break;
        }
      }
  
      if (index === -1)
        return;
  
      this.setState({currentParamIndex: index});
      const PARAM = new ROSLIB.Param({ros: this.props.ROS, name: param});
      PARAM.get(this.onParamValue.bind(this));
    }
  
    tick() {
      if (this.props.connected)
        this.props.ROS.getParams(this.listParams.bind(this));
      else
        this.setState({paramList: []});
    }
  
    getParamValues()
    {
      this.setState({getAllParamValues: true});
      this.setState({currentSelectedParamIndex: -1});
  
      this.getParamValue(this.getNextSelectedParam());
    }
  
    getParamValueFromState(param) {
      for (var i=0; i < this.state.paramList.length; i++) {
        if (this.state.paramList[i].paramName === param)
          return this.state.paramList[i].paramValue;
      }
  
      return "";
    }
  
    listParams(params) {
      const paramVals = [];
  
      for (var i=0; i < params.length; i++)
      {
          var param;
          param = {paramName: params[i], paramValue: this.getParamValueFromState(params[i])};
          paramVals.push(param); 
      }
  
      this.setState({paramList: paramVals});
      this.getParamValues();
    }
  
    toggleSelection(key, shiftKeyPressed, row) {
      console.log("toggleSelection: " + key + ", " + shiftKeyPressed + ", " + row);
      console.log(row);
  
      if (this.state.selectedParams.includes(row.paramName))
      {
        const sp = this.state.selectedParams;
        sp.splice(sp.indexOf(row.paramName), 1);
        this.setState({selectedParams: sp});
      }
      else
      {
        const sp = this.state.selectedParams;
        sp.push(row.paramName);
        this.setState({selectedParams: sp});
        this.getParamValue(row.paramName);
      }
    }
  
    toggleAll() {
  
    }
  
    isSelected(key) {
      // console.log("isSelected: " + key);
      if (this.state.selectedParams.includes(key))
        return true;
      else
        return false;
    }
  
    selectAll() {
  
    }
  
  
    render() {
  
      const columns = [{
        Header: 'Parameter',
        accessor: 'paramName'
      }, {
        Header: 'Value',
        accessor: 'paramValue'
      }
      
      ]
  
      const data = this.state.paramList;
      
      return(
        <div>
          <SelectTable selectType="checkbox" data={data} 
              columns={columns} showPagination={false} keyField="paramName"
              isSelected={this.isSelected.bind(this)}
              toggleSelection={this.toggleSelection.bind(this)}
              />
        </div>
        
      );
    }
  }

  export default ParamList;