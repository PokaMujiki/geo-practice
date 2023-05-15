import Plot from "react-plotly.js";
import React from "react";
import { format } from "date-fns";
import "../styles/events_by_time.css";
import {
  DEFAULT_EXCLUDED_GEO_EVENT_FILL_COLOR,
  DEFAULT_GEO_EVENT_FILL_COLOR,
  DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR,
} from "../lib/constants";
import { getUnselectedEvents } from "../lib/helpers";

export const EventsByTimePlot = ({ geoEvents, selectedGeoEvents }) => {
  if (!geoEvents?.length) {
    return;
  }

  const plotTitle = `Events magnitude by time plot for all events`;

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

  const unselected = getUnselectedEvents(geoEvents, selectedGeoEvents);

  for (let i = 0; i < unselected.length; i++) {
    let x = format(new Date(unselected[i].time), "yyyy-MM-dd HH:mm:ss");
    let y = Number(unselected[i].magnitude);

    if (y > max_magnitude) {
      max_magnitude = y;
    }
    if (y < min_magnitude) {
      min_magnitude = y;
    }

    seismicEvents.x.push(x);
    seismicEvents.y.push(y);
  }

  for (let i = 0; i < selectedGeoEvents.length; i++) {
    let x = format(new Date(selectedGeoEvents[i].time), "yyyy-MM-dd HH:mm:ss");
    let y = Number(selectedGeoEvents[i].magnitude);

    if (y > max_magnitude) {
      max_magnitude = y;
    }
    if (y < min_magnitude) {
      min_magnitude = y;
    }

    selectedSeismicEvents.x.push(x);
    selectedSeismicEvents.y.push(y);
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
    <div className="events_by_time_graph_wrapper">
      <Plot
        className="events_by_time_graph"
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
