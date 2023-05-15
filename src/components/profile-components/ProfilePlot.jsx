import { LatLng2TurfPoint, myPoint2TurfPoint } from "./ProfileHelpers";
import { lineString } from "@turf/helpers";
import * as turf from "@turf/turf";
import Plot from "react-plotly.js";
import React from "react";
import { DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR } from "../../lib/constants";
import { toNormalDate, toNormalTime } from "../../lib/helpers";

export const ProfilePlot = ({
  profileInfo,
  profileEvents,
  showUncertainty,
}) => {
  const start = LatLng2TurfPoint(profileInfo.positions[0]);
  const end = LatLng2TurfPoint(profileInfo.positions[1]);

  const line = lineString([
    start.geometry.coordinates,
    end.geometry.coordinates,
  ]);

  let distances = [];
  let depths = [];
  let uncertainty = [];
  let eventsSpecificOrder = [];
  let maxDepth = Number.MIN_VALUE;

  for (let i = 0; i < profileEvents.length; i++) {
    if (!profileEvents[i].depth) {
      // no depth data
      continue;
    }

    eventsSpecificOrder.push({
      magnitude: profileEvents[i].magnitude,
      magnitudeType: profileEvents[i].magnitudeType,
      depthUncertainty: profileEvents[i].depthUncertainty,
      time:
        toNormalDate(profileEvents[i].time) +
        " " +
        toNormalTime(profileEvents[i].time),
    });

    const toProject = myPoint2TurfPoint(profileEvents[i]);
    const projectedPoint = turf.nearestPointOnLine(line, toProject);

    const currentDistance = Number(
      turf.distance(start, projectedPoint) * 1000
    ).toFixed(0); // to meters
    distances.push(currentDistance);

    const currentDepth = Number(profileEvents[i].depth);
    depths.push(currentDepth);
    if (currentDepth > maxDepth) {
      maxDepth = currentDepth;
    }

    if (!profileEvents[i].depthUncertainty) {
      continue;
    }

    const currentUncertainty = Number(profileEvents[i].depthUncertainty);
    uncertainty.push({
      type: "line",
      x0: currentDistance,
      x1: currentDistance,
      y0: currentDepth - currentUncertainty,
      y1: currentDepth + currentUncertainty,
      line: {
        color: "rgb(214,214,213)",
        width: 1,
        dash: "solid",
      },
      opacity: 0.3,
    });
  }

  let maxDistance = turf.distance(start, end) * 1000; // to meters

  let trace = {
    x: distances,
    y: depths,
    customdata: eventsSpecificOrder,
    mode: "markers",
    type: "scatter",
    marker: {
      color: DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR,
    },
    hovertemplate:
      "%{yaxis.title.text}: %{y}<br>" +
      "%{xaxis.title.text}: %{x}<br>" +
      "magnitude: %{customdata.magnitude} (%{customdata.magnitudeType})<br>" +
      "date: %{customdata.time}<br>" +
      "unsertainty(meters): %{customdata.depthUncertainty}" +
      "<extra></extra>",
  };

  if (maxDepth === Number.MIN_VALUE) {
    // no events with depth data, make axis borders look better
    maxDepth = 15000;
  }

  return (
    <>
      <Plot
        className="profile_plot content_card_dark"
        data={[trace]}
        layout={{
          title: {
            text:
              "distribution of hypocenters along a linear profile " +
              profileInfo.profileNames[0] +
              "-" +
              profileInfo.profileNames[1],
          },

          shapes: showUncertainty ? uncertainty : [],

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
              text: "depth in meters",
              standoff: 40,
            },
            range: [maxDepth + 700, 0],
            gridcolor: "gray",
            tickcolor: "transparent",
          },
          xaxis: {
            automargin: true,
            title: {
              text: "distance over profile in meters",
              standoff: 20,
            },
            range: [-10, maxDistance + 10],
            gridcolor: "gray",
            tickcolor: "transparent",
          },
        }}
      />
    </>
  );
};
