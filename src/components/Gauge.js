import React from 'react';

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



class Gauge2 extends React.Component {
  constructor(props) {
    super(props);    
  }

  _getPathValues = (value) => {
    if (value < this.props.min) value = this.props.min;
    if (value > this.props.max) value = this.props.max;

    var dx = 0;
    var dy = 0;

    var alpha = (1 - (value - this.props.min) / (this.props.max - this.props.min)) * Math.PI;
    var Ro = this.props.width / 2 - this.props.width / 10;
    var Ri = Ro - this.props.width / 6.666666666666667;

    var Cx = this.props.width / 2 + dx;
    var Cy = this.props.height / 1.25 + dy;

    var Xo = this.props.width / 2 + dx + Ro * Math.cos(alpha);
    var Yo = this.props.height - (this.props.height - Cy) - Ro * Math.sin(alpha);
    var Xi = this.props.width / 2 + dx + Ri * Math.cos(alpha);
    var Yi = this.props.height - (this.props.height - Cy) - Ri * Math.sin(alpha);

    return { alpha, Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi };
  };

  _getPath = (value) => {
    let { Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi } = this._getPathValues(value);

    let path = "M" + (Cx - Ri) + "," + Cy + " ";
    path += "L" + (Cx - Ro) + "," + Cy + " ";
    path += "A" + Ro + "," + Ro + " 0 0 1 " + Xo + "," + Yo + " ";
    path += "L" + Xi + "," + Yi + " ";
    path += "A" + Ri + "," + Ri + " 0 0 0 " + (Cx - Ri) + "," + Cy + " ";
    path += "Z ";

    return path;
  };

  getValue(value) {
    return value / this.props.scale;
  }

  getColor(value) {
    if (value <= this.props.valueWarn)
      return defaultProps.color;
    else if (value < this.props.valueCrit)
      return defaultProps.colorWarn;
    else
      return defaultProps.colorCrit;
  }

  render() {
    let { Cx, Ro, Ri, Xo, Cy, Xi } = this._getPathValues(this.props.max);

    return (
      <svg height="100%" version="1.1" width="100%" xmlns="http://www.w3.org/2000/svg" style={{
        width: this.props.width,
        height: this.props.height,
        overflow: 'hidden',
        position: 'relative',
        left: 0,
        top: 0
      }}>
        <defs>
          <filter id={this.props.id}>
            <feOffset dx="0" dy="3"/>
            <feGaussianBlur result="offset-blur" stdDeviation="5"/>
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
            <feFlood floodColor="black" floodOpacity="0.2" result="color"/>
            <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
            <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
          </filter>
        </defs>
        <path fill={defaultProps.backgroundColor} stroke="none" d={this._getPath(this.props.max)}
              filter={"url(#" + this.props.id + ")"}/>
        <path fill={this.getColor(this.props.value)} stroke="none" d={this._getPath(this.props.value)}
            filter={"url(#" + this.props.id + ")"}/>
        <text x={this.props.width / 2} y={this.props.height / 8} textAnchor="middle" style={defaultProps.topLabelStyle}>
        {this.props.label}
        </text>
        <text x={this.props.width / 2} y={this.props.height / 5 * 4} textAnchor="middle" style={defaultProps.valueLabelStyle}>
          { this.getValue(this.props.value)}
        </text>
        <text x={((Cx - Ro) + (Cx - Ri)) / 2} y={Cy + 15} textAnchor="middle" style={defaultProps.minMaxLabelStyle}>
          {this.getValue(this.props.min)}
        </text>
        <text x={(Xo + Xi) / 2} y={Cy + 15} textAnchor="middle" style={defaultProps.minMaxLabelStyle}>
          {this.getValue(this.props.max)}
        </text>  
      </svg>
    );
  }

};

export default Gauge2;
