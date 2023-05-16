import Plot from "react-plotly.js";
import React, { useMemo, useState } from "react";
import { TextFieldLeftCaption } from "./TextFieldLeftCaption";
import "../styles/b_value_graph_container.css";
import "../styles/content_cards.css";
import {
  DEFAULT_EXCLUDED_GEO_EVENT_FILL_COLOR,
  DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR,
} from "../lib/constants";
import { isPositiveNumber } from "../lib/helpers";

const MAGNITUDE_MIN = -1.3;
const MAGNITUDE_MAX = 3.3;
const PREDICTED_PLOT_MAX_POINTS = 200;

const NOT_APPROXIMATED_POINTS_PLOT_NAME = "points not used in approximation";
const NOT_APPROXIMATED_POINTS_PLOT_MODE = "markers";
const NOT_APPROXIMATED_POINTS_PLOT_TYPE = "scatter";

const APPROXIMATED_POINTS_PLOT_NAME = "points used in approximation";
const APPROXIMATED_POINTS_PLOT_MODE = "markers";
const APPROXIMATED_POINTS_PLOT_TYPE = "scatter";

const PREDICTED_FUNCTION_PLOT_NAME = "prediction";
const PREDICTED_FUNCTION_PLOT_MODE = "lines";
const PREDICTED_FUNCTION_PLOT_TYPE = "scatter";

// approximates given set of points by linear function (ax + b)
const approximate = (x_points, y_points) => {
  const x_sum = x_points.reduce((prev, cur) => prev + cur, 0);
  const y_sum = y_points.reduce((prev, cur) => prev + cur, 0);
  const x_mean = x_sum / x_points.length;
  const y_mean = y_sum / y_points.length;

  // function
  // f(M) = lg(N) = a - b * M
  // theory:
  // y_i = beta_1 + beta_2 * x_i

  let beta_2_th_numerator = 0;
  let beta_2_th_denominator = 0;
  for (let i = 0; i < y_points.length; i++) {
    beta_2_th_numerator += (y_points[i] - y_mean) * (x_points[i] - x_mean);
    beta_2_th_denominator += (x_points[i] - x_mean) * (x_points[i] - x_mean);
  }

  const beta_2_th = beta_2_th_numerator / beta_2_th_denominator; // b-value
  const beta_1_th = y_mean - beta_2_th * x_mean; // a-value

  let x_predicted_plot = [];
  let y_predicted_plot = [];
  for (let i = 0; i < PREDICTED_PLOT_MAX_POINTS; i++) {
    x_predicted_plot[i] =
      MAGNITUDE_MIN +
      (i * (MAGNITUDE_MAX - MAGNITUDE_MIN)) / PREDICTED_PLOT_MAX_POINTS;
    y_predicted_plot[i] = beta_1_th + beta_2_th * x_predicted_plot[i];
  }

  return {
    x_predicted_plot,
    y_predicted_plot,
    beta_1_th,
    beta_2_th,
  };
};

const calculatePoints = (geoEvents, step) => {
  const y_points = [];
  const x_points = [];

  for (let i = 0; i < (MAGNITUDE_MAX - MAGNITUDE_MIN) / step; i++) {
    x_points[i] = step * i;
    y_points[i] = Math.log10(
      geoEvents.filter((item) => Number(item.magnitude) >= x_points[i]).length
    );
    if (y_points[i] === 0) {
      break;
    }
  }
  return {
    x_points,
    y_points,
  };
};

const filterPoints = (
  x_points,
  y_points,
  selectedRightPoint,
  selectedLeftPoint
) => {
  let middleIndex = Math.floor(x_points.length / 2);
  let included = { x: [], y: [] };
  let excluded = { x: [], y: [] };

  for (let i = 0; i < middleIndex; i++) {
    if (x_points[i] < selectedLeftPoint.x) {
      excluded.x.push(x_points[i]);
      excluded.y.push(y_points[i]);
    } else {
      included.x.push(x_points[i]);
      included.y.push(y_points[i]);
    }
  }

  for (let i = middleIndex; i < x_points.length; i++) {
    if (x_points[i] > selectedRightPoint.x) {
      excluded.x.push(x_points[i]);
      excluded.y.push(y_points[i]);
    } else {
      included.x.push(x_points[i]);
      included.y.push(y_points[i]);
    }
  }

  return { included, excluded };
};

export const BValuePlot = ({ seismicEvents }) => {
  const onGraphPointClick = (clickedPoint) => {
    let x_middle = x_points[Math.floor(x_points.length / 2)];
    if (clickedPoint.x < x_middle) {
      setSelectedLeftPoint(clickedPoint);
    } else {
      setSelectedRightPoint(clickedPoint);
    }
  };

  const [step, setStep] = useState(0.05);
  const [selectedRightPoint, setSelectedRightPoint] = useState({
    x: 100,
    y: 100000,
  });
  const [selectedLeftPoint, setSelectedLeftPoint] = useState({
    x: -1,
    y: -1,
  });

  const { x_points, y_points } = useMemo(
    () => calculatePoints(seismicEvents, step),
    [seismicEvents, step]
  );

  let filteredPoints = filterPoints(
    x_points,
    y_points,
    selectedRightPoint,
    selectedLeftPoint
  );

  let { x_predicted_plot, y_predicted_plot, beta_1_th, beta_2_th } =
    approximate(filteredPoints.included.x, filteredPoints.included.y);

  const approximatedFunctionTrace = {
    x: x_predicted_plot,
    y: y_predicted_plot,
    name: PREDICTED_FUNCTION_PLOT_NAME,
    mode: PREDICTED_FUNCTION_PLOT_MODE,
    type: PREDICTED_FUNCTION_PLOT_TYPE,
  };

  const usedInApproximationTrace = {
    x: filteredPoints.included.x,
    y: filteredPoints.included.y,
    name: APPROXIMATED_POINTS_PLOT_NAME,
    mode: APPROXIMATED_POINTS_PLOT_MODE,
    type: APPROXIMATED_POINTS_PLOT_TYPE,
    marker: {
      color: DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR,
    },
  };

  const notUsedInApproximationTrace = {
    x: filteredPoints.excluded.x,
    y: filteredPoints.excluded.y,
    name: NOT_APPROXIMATED_POINTS_PLOT_NAME,
    mode: NOT_APPROXIMATED_POINTS_PLOT_MODE,
    type: NOT_APPROXIMATED_POINTS_PLOT_TYPE,
    marker: {
      color: DEFAULT_EXCLUDED_GEO_EVENT_FILL_COLOR,
    },
  };

  const validatedSet = (v) => {
    const numberV = Number(v);
    if (isNaN(numberV)) {
      return;
    }
    setStep(numberV);
  };

  // todo validate set better

  return (
    <div className="b_value_graph_wrapper">
      <Plot
        className="content_card_dark b_value_graph"
        data={[
          usedInApproximationTrace,
          notUsedInApproximationTrace,
          approximatedFunctionTrace,
        ]}
        layout={{
          plot_bgcolor: "#333945",
          paper_bgcolor: "#2e333d",
          font: {
            color: "#d3d4d0",
            size: 16,
            family: "Inter",
            weigh: 400,
          },
          autosize: true,
          title: "b-value graph",
          showlegend: false,

          xaxis: {
            title: "Magnitude",
            range: [MAGNITUDE_MIN, MAGNITUDE_MAX],
            gridcolor: "gray",
            zerolinecolor: "green",
            tickmode: "linear",
            tick0: 0.5,
            dtick: 0.5,
            tickcolor: "transparent",
          },

          yaxis: {
            title: "Lg N",
            range: [-0.3, 3.3],
            gridcolor: "gray",
            zerolinecolor: "green",
            tickcolor: "transparent",
            tickmode: "linear",
            tick0: 0.5,
            dtick: 0.5,
          },
        }}
        onClick={(data) =>
          onGraphPointClick({ x: data.points[0].x, y: data.points[0].y })
        }
      />
      <div className="b_value_panels_wrapper">
        <div className="content_card_dark b_value_legends">
          <p>
            {" "}
            <span style={{ color: DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR }}>
              blue points{" "}
            </span>{" "}
            are used in approximation
          </p>
          <p>
            {" "}
            <span style={{ color: DEFAULT_EXCLUDED_GEO_EVENT_FILL_COLOR }}>
              orange points{" "}
            </span>{" "}
            are excluded from approximation{" "}
          </p>
        </div>
        <div className="content_card_dark b_value_info">
          <p>b-value: {-beta_2_th.toFixed(3)}</p>
          <p>a-value: {beta_1_th.toFixed(3)}</p>
          <p>approximation error: TBA</p>
        </div>
        <div className="content_card_dark b_value_options">
          <TextFieldLeftCaption
            value={step}
            onChange={(e) =>
              isPositiveNumber(e.target.value)
                ? validatedSet(e.target.value)
                : null
            }
            type="number"
            caption="Step to place points"
          />
        </div>
      </div>
    </div>
  );
};
