import React from 'react';
import './../App.css';
import ReactTable from 'react-table';
import selectTableHOC from 'react-table/lib/hoc/selectTable';
import 'react-table/react-table.css';
import Grid from '@material-ui/core/Grid';

const SelectTable = selectTableHOC(ReactTable); 

class NodeList extends React.Component {
    constructor(props) {
      super(props);    
      this.state = {runningNodes: [], selectedNode: "", 
                    runningTopics: [], selectedTopic: ""};
    }
  
    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        5000
      );
    }
  
    componentWillUnmount() {
      clearInterval(this.timerID);
    }

    componentDidUpdate(prevProps) {
      if (this.props.connected !== prevProps.connected && this.props.connected)
        this.tick();
    }
  
    tick() {
      if (this.props.connected)
      {
        this.props.ROS.getNodes(this.listNodes.bind(this));
        this.props.ROS.getTopics(this.listTopics.bind(this));
      }
      else
      {
        this.setState({runningNodes: [], runningTopics: []});
      }
    }

    listTopics(topics) {
        const topicVals = [];

        console.log(topics.topics.length);
  
        for (var i=0; i < topics.topics.length; i++)
        {
            var topic;
            topic = {topicName: topics.topics[i], topicType: topics.types[i]};
            topicVals.push(topic); 
        }
    
        this.setState({runningTopics: topicVals});  
    }
  
    listNodes(nodes) {
      const nodeVals = [];
  
      for (var i=0; i < nodes.length; i++)
      {
          var node;
          node = {nodeName: nodes[i]};
          nodeVals.push(node); 
      }
  
      this.setState({runningNodes: nodeVals});
    }

    isSelected(key) {
        // console.log("isSelected: " + key);
        if (this.state.selectedNode === key)
          return true;
        else
          return false;
    }


    isTopicSelected(key) {
        // console.log("isSelected: " + key);
        if (this.state.selectedTopic === key)
          return true;
        else
          return false;
    }

    toggleSelection(key, shiftKeyPressed, row) {
        console.log("toggleSelection: " + key + ", " + shiftKeyPressed + ", " + row);
        console.log(row);
    
        if (this.state.selectedNode === row.nodeName)
        {
          this.setState({selectedNode: ""});
        }
        else
        {
          this.setState({selectedNode: row.nodeName});
        }
    }

    toggleTopicSelection(key, shiftKeyPressed, row) {
    
        if (this.state.selectedTopic === row.topicName)
        {
          this.setState({selectedTopic: ""});
        }
        else
        {
          this.setState({selectedTopic: row.topicName});
        }
    }
  
  
    render() {
      const columns = [{
        Header: 'Node',
        accessor: 'nodeName'
      }]

      const topicColumns = [{
        Header: 'Topic',
        accessor: 'topicName'
      }, {
        Header: 'Type',
        accessor: 'topicType'  
      }]
  
      const data = this.state.runningNodes;
      const topicData = this.state.runningTopics;
      
      return(
        <div>
        <Grid container direction="row" alignItems="flex-start" spacing={2}>
            <Grid item >
                <SelectTable selectType="checkbox" data={data} columns={columns} 
                        showPagination={false} 
                        keyField="nodeName"
                        isSelected={this.isSelected.bind(this)}
                        toggleSelection={this.toggleSelection.bind(this)}
                        />
            </Grid>
            <Grid item >
           <SelectTable selectType="checkbox" data={topicData} columns={topicColumns} 
                        showPagination={false} 
                        keyField="topicName"
                        isSelected={this.isTopicSelected.bind(this)}
                        toggleSelection={this.toggleTopicSelection.bind(this)}
                        />
            </Grid>
        </Grid>
        </div>
        
      );
    }
  }

  export default NodeList;