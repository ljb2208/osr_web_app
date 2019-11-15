import React from 'react';
import './App.css';
import DetailTab from './components/DetailTab';
import ROSLIB from 'roslib';
import 'react-table/react-table.css';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Fab from '@material-ui/core/Fab';
import RunStop from './components/RunStop';

function App() {
  return (
    <ROSConnection />
  );
}

class ConnectControl extends React.Component {
  // This syntax ensures `this` is bound within handleClick.
  // Warning: this is *experimental* syntax.
  constructor(props) {
    super(props);
    this.handleConnectClick = this.handleConnectClick.bind(this);
    this.handleDisconnectClick = this.handleDisconnectClick.bind(this);
  }

  handleConnectClick = (e) => {
    console.log('this is:', this);
    this.props.onStateChangeRequest(true);
  }

  handleDisconnectClick = (e) => {
    console.log('this is:', this);
    this.props.onStateChangeRequest(false);
  }

  render() {
    const isConnected = this.props.isConnected;

    console.log(isConnected);

    let button;

    if (!isConnected)
      button = <ConnectButton onClick={this.handleConnectClick} />;
    else
      button = <DisconnectButton onClick={this.handleDisconnectClick} />;

    return (
      <div>
      {button}
      </div>
    );
  }
}

class ConnectButton extends React.Component {
  render(){
    return (
      <Button onClick={this.props.onClick} variant="contained" color="secondary" size="small">Connect</Button>
    );
  }
}

class DisconnectButton extends React.Component {
  render(){
    return (
      <Button onClick={this.props.onClick} variant="contained" color="primary" size="small">Disconnect</Button>
    );
  }
}

class ConnectionState extends React.Component {

  render() {
    let connectionText;

    if (this.props.isConnected)
      connectionText = "Connected";
    else
    {
      if (this.props.isError)
        connectionText = "Disconnected: Error";
      else
        connectionText = "Disconnected";
    }

    return (
      <div>{connectionText}</div>
    );
  }
}

class ROSHostDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {localHostName: ""};
  }

  componentDidMount() {
    console.log("hostname: " + this.props.hostName);
    this.setState({localHostName: this.props.hostName});
  }

  handleCloseAndUpdate()
  {
    this.props.handleClickClose(this.state.localHostName);
  }

  handleClose()
  {
    this.props.handleClickClose(this.props.hostName);
  }

  handleChange = event => {
    this.setState({localHostName: event.target.value});
  }

  render() {
    return(
      <Dialog aria-labelledby="simple-dialog-title" open={this.props.open}>
        <DialogTitle id="simple-dialog-title">Set Host Name</DialogTitle>
        <TextField label="Set Hostname" margin="normal" value={this.state.localHostName} onChange={this.handleChange.bind(this)}></TextField>
        <Fab aria-label="update" onClick={this.handleCloseAndUpdate.bind(this)} size="small">
          <CheckIcon/>
        </Fab>
        <Fab aria-label="cancel" onClick={this.handleClose.bind(this)} size="small">
          <CloseIcon />
        </Fab>
      </Dialog>
    );
  }
}

class ROSHost extends React.Component {
  constructor(props) {
    super(props);
    this.state={hostDialogOpen: false};
  }

  handleHostNameChange = (e) => {
    console.log('this is:', this);
    this.props.onHostNatmeChange(e.target.value);
  }

  handleClickOpen() {
    this.setState({hostDialogOpen: true});
  }

  handleClickClose(value) {
    this.setState({hostDialogOpen: false});
    if(value !== this.props.hostName)
      this.props.onHostNameChange(value);
  }

  render() {
    return(
      <div>
        <Button variant="outlined" onClick={this.handleClickOpen.bind(this)}>{this.props.hostName}</Button>
        <ROSHostDialog open={this.state.hostDialogOpen} hostName={this.props.hostName} handleClickClose={this.handleClickClose.bind(this)} />
      </div>
    );
  }
}

class ROSConnection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {connected: false, ROS: new ROSLIB.Ros(), 
                hostName: "localhost", error: false};
    this.handleStateChangeRequest = this.handleStateChangeRequest.bind(this);
    this.handleHostNameChange = this.handleHostNameChange.bind(this);

    this.state.ROS.on("connection", this.onConnection.bind(this));
    this.state.ROS.on("error", this.onError.bind(this));
    this.state.ROS.on("close", this.onClose.bind(this));
  }


  componentDidMount() {
    document.title="Open Source Rover - ROS";
  }

  connect() {
    this.state.ROS.connect("ws://" + this.state.hostName + ":9090");
  }

  disconnect() {
    this.state.ROS.close();
  }

  handleStateChangeRequest(toConnect) {
    if (toConnect)
      this.connect();
    else
      this.disconnect();
  }

  handleHostNameChange(hostName) {

    if (hostName !== this.state.hostName)
    {
      if (this.state.connected)
        this.disconnect();

      this.setState({hostName: hostName});
    }
  }

  onConnection() {
    this.setState({connected: true, error: false});
    console.log("connected to ws");
  }

  onError(err) {
    console.log("error on ws");
    console.log(err);
    this.setState({error: true});
  }

  onClose() {
    this.setState({connected: false});
    console.log("closed ws");
  }

  render() {
    return (
      <div>
        <div>
          <AppBar position="static"> 
            <Grid container direction="row" alignItems="center">
                <Grid item xs>
                  <ROSHost hostName={this.state.hostName} onHostNameChange={this.handleHostNameChange}/>
                </Grid>
                <Grid item xs>
                  <ConnectControl isConnected={this.state.connected} onStateChangeRequest={this.handleStateChangeRequest} />
                </Grid>
                <Grid item xs>
                  <ConnectionState isConnected={this.state.connected} isError={this.state.error}/>
                </Grid>
                <Grid item xs>
                  <RunStop isConnected={this.state.connected} ROS={this.state.ROS}/>
                </Grid>
            </Grid>
          </AppBar>
        </div>
        <div>
          <DetailTab ROS={this.state.ROS} connected={this.state.connected}/>
        </div>
      </div>);
  }
}

export default App;
