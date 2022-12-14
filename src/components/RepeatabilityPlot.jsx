import Plot from "react-plotly.js";
import React from "react";
import {format} from "date-fns";
import '../styles/repeatability_graph_wrapper.css';

export const RepeatabilityPlot = ({geoEvents}) => {
  if (!geoEvents?.length) {
    return;
  }

  const plotTitle = `Repeatability plot for ${geoEvents.length} events`;

  let x_dots = [];
  let y_dots = [];
  let max_magnitude = Number(geoEvents[0].magnitude);
  let min_magnitude = Number(geoEvents[0].magnitude);
  for (let i = 0; i < geoEvents.length; i++) {
    x_dots[i] = format(new Date(geoEvents[i].time), "yyyy-MM-dd HH:mm:ss");
    y_dots[i] = Number(geoEvents[i].magnitude);

    if (y_dots[i] > max_magnitude) {
      max_magnitude = y_dots[i];
    }
    if (y_dots[i] < min_magnitude) {
      min_magnitude = y_dots[i];
    }
  }

  const trace_function = {
    x: x_dots,
    y: y_dots,
    mode: 'markers',
    type: 'scatter',
    marker: {
      color: "#fa2f2f",
      opacity: 0.5,
      size: 4,
    },
  }

  return (
    <div className="repeatability_graph_wrapper">
      <Plot
        className="repeatability_graph"
        data={[trace_function]}
        layout={{
          title: {
            text: plotTitle,
          },

          autosize: true,

          plot_bgcolor: "#333945",
          paper_bgcolor: "#2e333d",
          font: {
            color: "#d3d4d0",
            size: 16,
            family: "Inter",
            weigh: 400,
          },
          showlegend: false,

          yaxis: {
            title: {
              text: "Magnitude",
              standoff: 40,
            },
            range: [min_magnitude - 0.5, max_magnitude + 0.5],
            gridcolor: "gray",
            zerolinecolor: "green",
            tickcolor: "transparent",
          },
          xaxis: {
            gridcolor: "gray",
            zerolinecolor: "green",
            tickcolor: "transparent",
          }
        }}
      />
  </div>);
}