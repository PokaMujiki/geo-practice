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
import {
  DEFAULT_GEO_EVENT_FILL_COLOR,
  DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR,
} from "../../lib/constants";

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
  let maxDepth = Number.MIN_VALUE;
  let minDepth = Number.MAX_VALUE;
  for (let i = 0; i < profilePoints.length; i++) {
    let toProject = myPoint2TurfPoint(profilePoints[i]);
    const projectedPoint = turf.nearestPointOnLine(line, toProject);
    distances.push(turf.distance(start, projectedPoint) * 1000); // to meters
    // todo: если нету разброса или даже глубины то что тогда делать?
    const currentDepth = Number(profilePoints[i].depth);
    depths.push(currentDepth);
    if (currentDepth > maxDepth) {
      maxDepth = currentDepth;
    }
    if (currentDepth < minDepth) {
      minDepth = currentDepth;
    }
  }

  let maxDistance = turf.distance(start, end) * 1000; // to meters

  let trace = {
    x: distances,
    y: depths,
    mode: "markers",
    type: "scatter",
    marker: {
      color: DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR,
    },
  };

  return (
    <>
      <Plot
        className="profile_plot content_card_dark"
        data={[trace]}
        layout={{
          title: {
            text: "distribution of hypocenters along a linear profile",
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
              text: "depth in meters",
              standoff: 40,
            },
            range: [maxDepth + 100, minDepth - 100],
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
