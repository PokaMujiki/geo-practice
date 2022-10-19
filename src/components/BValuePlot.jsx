import Plot from "react-plotly.js";
import React from "react";

export const BValuePlot = ({geoEvents}) => {
  if (!geoEvents?.length) {
    return;
  }
  
  let plotTitle = `B-value for ${geoEvents.length} selected events`;
  
  if (geoEvents.length <= 1) {
    plotTitle = `B-value for ${geoEvents.length} selected event`;
  }

  let y_axis = [];
  let x_axis = [];
  for (let i = 0; i < 20; i++) {
    y_axis[i] = geoEvents.filter(item => item.magnitude >= 0.5 * i).length / geoEvents.length;
    x_axis[i] = i / 2;
    if (y_axis[i] === 0) {
      break;
    }
  }

  const trace_dots = {
    x: x_axis,
    y: y_axis,
    mode: 'markers',
    type: 'scatter'
  };



  const trace_function = {

  }

  return (
  <Plot
    data={[trace_dots]}
    layout={{
      width: 600,
      height: 400,
      title: plotTitle,
      xaxis: {range: [0, x_axis[x_axis.length - 1]]},
      yaxis: {range: [0, 1]},
    }}
  />);
}