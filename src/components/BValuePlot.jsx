import Plot from "react-plotly.js";
import React from "react";
import {MAX_DOTS} from "../lib/constants";

export const BValuePlot = ({geoEvents, a_value, b_value}) => {
  if (!geoEvents?.length) {
    return;
  }
  
  let plotTitle = `B-value for ${geoEvents.length} selected events`;
  
  if (geoEvents.length <= 1) {
    plotTitle = `B-value for ${geoEvents.length} selected event`;
  }

  const y_axis = [];
  const x_axis = [];
  for (let i = 0; i < 20; i++) {
    y_axis[i] = geoEvents.filter(item => item.magnitude >= 0.5 * i).length / geoEvents.length;
    x_axis[i] = i / 2;
    if (y_axis[i] === 0) {
      break;
    }
  }

  const user_y_axis = [];
  const user_x_axis = [];
  for (let i = 0; i < MAX_DOTS; i++) {
    x_axis[i] = i * 10 / MAX_DOTS;
    y_axis[i] = Math.pow(10, a_value - b_value * x_axis[i]) / Math.pow(10, a_value);
  }

  const trace_dots = {
    x: x_axis,
    y: y_axis,
    mode: 'markers',
    type: 'scatter'
  };

  const trace_function = {
    x: user_x_axis,
    y: y_axis,
    mode: 'lines',
    type: 'scatter',
  }

  return (
  <Plot
    data={[trace_dots, trace_function]}
    layout={{
      width: 600,
      height: 400,
      title: plotTitle,
      xaxis: {range: [0, 4]},
      yaxis: {range: [0, 1]},
    }}
  />);
}