import Plot from "react-plotly.js";
import React from "react";
import {format} from "date-fns";

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
      color: 'rgb(17, 157, 255)',
      size: 4,
    },
  }

  return (
    <div className="repeatability_plot_wrapper">
      <Plot
        data={[trace_function]}
        layout={{
          width: "full",
          height: "full",
          title: plotTitle,
          yaxis: {
            title: "Magnitude",
            range: [min_magnitude - 0.5, max_magnitude + 0.5],
          },
        }}
      />
  </div>);
}