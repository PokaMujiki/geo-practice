import L from "leaflet";
import {
  LatLng2TurfPoint,
  myPoint2TurfPoint,
  pointsInParallelPolygon,
} from "./ProfileHelpers";
import { lineString } from "@turf/helpers";
import * as turf from "@turf/turf";
import Plot from "react-plotly.js";
import React from "react";
import { DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR } from "../../lib/constants";
import { toNormalDate, toNormalTime } from "../../lib/helpers";

export const ProfilePlot = ({ profileInfo, geoEvents }) => {
  let profilePoints = pointsInParallelPolygon(profileInfo, geoEvents);

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
  let minDepth = Number.MAX_VALUE;

  for (let i = 0; i < profilePoints.length; i++) {
    if (!profilePoints[i].depth) {
      // no depth data
      continue;
    }

    eventsSpecificOrder.push({
      magnitude: profilePoints[i].magnitude,
      magnitudeType: profilePoints[i].magnitudeType,
      depthUncertainty: profilePoints[i].depthUncertainty,
      time:
        toNormalDate(profilePoints[i].time) +
        " " +
        toNormalTime(profilePoints[i].time),
    });

    const toProject = myPoint2TurfPoint(profilePoints[i]);
    const projectedPoint = turf.nearestPointOnLine(line, toProject);

    const currentDistance = Number(
      turf.distance(start, projectedPoint) * 1000
    ).toFixed(0); // to meters
    distances.push(currentDistance);

    const currentDepth = Number(profilePoints[i].depth);
    depths.push(currentDepth);
    if (currentDepth > maxDepth) {
      maxDepth = currentDepth;
    }
    if (currentDepth < minDepth) {
      minDepth = currentDepth;
    }

    if (!profilePoints[i].depthUncertainty) {
      continue;
    }

    const currentUncertainty = Number(profilePoints[i].depthUncertainty);
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
    minDepth = 0;
  }

  console.log(eventsSpecificOrder);

  return (
    <>
      <Plot
        className="profile_plot content_card_dark"
        data={[trace]}
        layout={{
          title: {
            text: "distribution of hypocenters along a linear profile",
          },

          shapes: uncertainty,

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
            range: [maxDepth + 700, minDepth - 700],
            gridcolor: "gray",
            zerolinecolor: "green",
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
            zerolinecolor: "green",
            tickcolor: "transparent",
          },
        }}
      />
    </>
  );
};
