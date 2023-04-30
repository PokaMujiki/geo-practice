import Plot from "react-plotly.js";
import React from "react";
import { format } from "date-fns";
import "../styles/repeatability_graph_wrapper.css";
import {
  DEFAULT_EXCLUDED_GEO_EVENT_FILL_COLOR,
  DEFAULT_GEO_EVENT_FILL_COLOR,
  DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR,
} from "../lib/constants";

export const RepeatabilityPlot = ({ geoEvents }) => {
  if (!geoEvents?.length) {
    return;
  }

  const plotTitle = `Repeatability plot for all events`;

  let seismicEvents = {
    x: [],
    y: [],
  };

  let selectedSeismicEvents = {
    x: [],
    y: [],
  };

  let excludedSeismicEvents = {
    x: [],
    y: [],
  };

  let max_magnitude = Number(geoEvents[0].magnitude);
  let min_magnitude = Number(geoEvents[0].magnitude);
  for (let i = 0; i < geoEvents.length; i++) {
    let x = format(new Date(geoEvents[i].time), "yyyy-MM-dd HH:mm:ss");
    let y = Number(geoEvents[i].magnitude);

    if (y > max_magnitude) {
      max_magnitude = y;
    }
    if (y < min_magnitude) {
      min_magnitude = y;
    }

    if (geoEvents[i].selected) {
      selectedSeismicEvents.x.push(x);
      selectedSeismicEvents.y.push(y);
    } else if (geoEvents[i].excluded) {
      excludedSeismicEvents.x.push(x);
      excludedSeismicEvents.y.push(y);
    } else {
      seismicEvents.x.push(x);
      seismicEvents.y.push(y);
    }
  }

  const seismicEventsTrace = {
    x: seismicEvents.x,
    y: seismicEvents.y,
    mode: "markers",
    type: "scatter",
    marker: {
      color: DEFAULT_GEO_EVENT_FILL_COLOR,
      opacity: 0.5,
      size: 4,
    },
  };

  const selectedSeismicEventsTrace = {
    x: selectedSeismicEvents.x,
    y: selectedSeismicEvents.y,
    mode: "markers",
    type: "scatter",
    marker: {
      color: DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR,
      size: 6,
    },
  };

  const excludedSeismicEventsTrace = {
    x: excludedSeismicEvents.x,
    y: excludedSeismicEvents.y,
    mode: "markers",
    type: "scatter",
    marker: {
      color: DEFAULT_EXCLUDED_GEO_EVENT_FILL_COLOR,
      size: 6,
    },
  };

  return (
    <div className="repeatability_graph_wrapper">
      <Plot
        className="repeatability_graph"
        data={[
          seismicEventsTrace,
          selectedSeismicEventsTrace,
          excludedSeismicEventsTrace,
        ]}
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
            automargin: true,
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
          },
        }}
      />
    </div>
  );
};
