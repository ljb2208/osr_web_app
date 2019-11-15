import React from 'react';
import ROSLIB from 'roslib';

const defaultProps = {
  label: "React SVG Gauge",
  min: 0,
  max: 100,
  value: 40,
  width: 400,
  height: 320,
  color: '#fe0400',
  colorWarn: '#fe0400',
  colorCrit: '#fe0400',
  backgroundColor: "#edebeb",
  topLabelStyle: {
    textAnchor: "middle",
    fill: "#999999",
    stroke: "none",
    fontStyle: "normal",
    fontVariant: "normal",
    fontWeight: 'bold',
    fontStretch: 'normal',
    lineHeight: 'normal',
    fillOpacity: 1,
    fontSize: 10
  },
  valueLabelStyle: {
    textAnchor: "middle",
    fill: "#010101",
    stroke: "none",
    fontStyle: "normal",
    fontVariant: "normal",
    fontWeight: 'bold',
    fontStretch: 'normal',
    lineHeight: 'normal',
    fillOpacity: 1
  },
  minMaxLabelStyle: {
    textAnchor: "middle",
    fill: "#999999",
    stroke: "none",
    fontStyle: "normal",
    fontVariant: "normal",
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontSize: 12,
    lineHeight: 'normal',
    fillOpacity: 1
  },
  valueFormatter: (value) => `${value}`
};



class RoverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {enc_angles: [30,-30,0,0], tester: 0, enc_abs: [0,0,0,0]}; 
  }

  componentDidMount() {
    this.enc_min = new ROSLIB.Param({ros: this.props.ROS, name: "/enc_min"});
    this.enc_max = new ROSLIB.Param({ros: this.props.ROS, name: "/enc_min"});
    this.topic = new ROSLIB.Topic({ros: this.props.ROS, name: "/encoder",
      messageType: "osr_msgs/Encoder"});

    this.tick();
      
    this.timerID = setInterval(
      () => this.tick(),
      5000
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.connected !== prevProps.connected)
    {
      if (this.props.connected) {
        this.topic.subscribe(this.onMessage.bind(this));
      } else {
        this.topic.unsubscribe();
      }
    }
  }

  onMessage(value) {
    var angles = [0,0,0,0];
    for (var i=0; i < value.abs_enc.length; i++) {
      var len = this.state.enc_max[i] - this.state.enc_min[i];
      var mid = len / 2;

      angles[i] = (value.abs_enc[i] - mid) / (len /2) * 45;
    }

    this.setState({enc_abs: value.abs_enc});
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick()
  {
    if (this.state.tester === 0)
      this.setState({enc_angles: [0,0, 30, -30], tester: 1});
    else
      this.setState({enc_angles: [30,-30, 0, 0], tester: 0});


    if (this.props.connected)
    {
      this.enc_min.get(this.onEncMinValue.bind(this));
      this.enc_max.get(this.onEncMaxValue.bind(this));
    }
  }

  onEncMinValue(value) {
    this.setState({enc_min: value});
  }

  onEncMaxValue(value) {
    this.setState({enc_max: value});
  }

  getTransform(index, x, y) {
    return "rotate(" + this.state.enc_angles[index] + ", " + x + "," +  y + ")";
  }

  render() {
  
    return (
      <svg height="100%" version="1.1" width="100%" xmlns="http://www.w3.org/2000/svg" style={{
        width: this.props.width,
        height: this.props.height,
        overflow: 'hidden',
        position: 'relative',
        left: 0,
        top: 0
      }}>
        <rect x="100" y="125" width="100" height="130" fill="red" stroke="black" strokeWidth="5" opacity="0.5" />
        <rect x="20" y="20" width="30" height="60" fill="gray" stroke="black" strokeWidth="5" opacity="0.5" rx="5" ry="5" transform={this.getTransform(0,35,50)}/>
        <rect x="30" y="160" width="30" height="60" fill="gray" stroke="black" strokeWidth="5" opacity="0.5" rx="5" ry="5"/>
        <rect x="20" y="300" width="30" height="60" fill="gray" stroke="black" strokeWidth="5" opacity="0.5" rx="5" ry="5" transform={this.getTransform(1, 35,330)}/>
        <rect x="250" y="20" width="30" height="60" fill="gray" stroke="black" strokeWidth="5" opacity="0.5" rx="5" ry="5" transform={this.getTransform(2,265,50)}/>
        <rect x="240" y="160" width="30" height="60" fill="gray" stroke="black" strokeWidth="5" opacity="0.5" rx="5" ry="5"/>
        <rect x="250" y="300" width="30" height="60" fill="gray" stroke="black" strokeWidth="5" opacity="0.5" rx="5" ry="5" transform={this.getTransform(3,265,330)}/>
        <text x="35" y="105" textAnchor="middle" style={defaultProps.minMaxLabelStyle}>
          {this.state.enc_angles[0]}&deg; : {this.state.enc_abs[0]}
        </text>
        <text x="35" y="385" textAnchor="middle" style={defaultProps.minMaxLabelStyle}>
          {this.state.enc_angles[1]}&deg; : {this.state.enc_abs[1]}
        </text>
        <text x="265" y="105" textAnchor="middle" style={defaultProps.minMaxLabelStyle}>
          {this.state.enc_angles[2]}&deg; : {this.state.enc_abs[2]}
        </text>
        <text x="265" y="385" textAnchor="middle" style={defaultProps.minMaxLabelStyle}>
          {this.state.enc_angles[3]}&deg; : {this.state.enc_abs[3]}
        </text>
      </svg>
    );
  }

};

export default RoverView;
