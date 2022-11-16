import Plot from "react-plotly.js";
import React, {useEffect, useState} from "react";

const MAGNITUDE_MIN = -1.5;
const MAGNITUDE_MAX = 3;
const PREDICTED_PLOT_MAX_POINTS = 200;

const NOT_APPROXIMATED_POINTS_PLOT_NAME = "points used in approximation";
const NOT_APPROXIMATED_POINTS_PLOT_MODE = "markers";
const NOT_APPROXIMATED_POINTS_PLOT_TYPE = "scatter";

const APPROXIMATED_POINTS_PLOT_NAME = "points not used in approximation";
const APPROXIMATED_POINTS_PLOT_MODE = "markers";
const APPROXIMATED_POINTS_PLOT_TYPE = "scatter";

const PREDICTED_FUNCTION_PLOT_NAME = "prediction";
const PREDICTED_FUNCTION_PLOT_MODE = "lines";
const PREDICTED_FUNCTION_PLOT_TYPE = "scatter"

const selectLastPointForApproximation = (data, approximatedPoints, notApproximatedPoints, setApproximatedPoints, setNotApproximatedPoints) => {
  let useInApproximation_x = [];
  let useInApproximation_y = [];
  let notUseInApproximation_x = [];
  let notUseInApproximation_y = [];

  approximatedPoints.y.concat(notApproximatedPoints.y).map((item) => {
    // use all points below marked one
    if (data.points[0].y >= item.y) {
      useInApproximation_y.push(item.y);
      useInApproximation_x.push(item.x);
    }
    else {
      notUseInApproximation_y.push(item.y);
      notUseInApproximation_x.push(item.x);
    }
  });

  setApproximatedPoints({
    x: useInApproximation_x,
    y: useInApproximation_y,
    name: APPROXIMATED_POINTS_PLOT_NAME,
    mode: APPROXIMATED_POINTS_PLOT_MODE,
    type: APPROXIMATED_POINTS_PLOT_TYPE,
  });

  setNotApproximatedPoints({
    x: notUseInApproximation_x,
    y: notUseInApproximation_y,
    name: NOT_APPROXIMATED_POINTS_PLOT_NAME,
    mode: NOT_APPROXIMATED_POINTS_PLOT_MODE,
    type: NOT_APPROXIMATED_POINTS_PLOT_TYPE,
  });
}

export const BValuePlot = ({geoEvents, step}) => {
  const y_points = [];
  const x_points = [];

  for (let i = 0; i < (MAGNITUDE_MAX - MAGNITUDE_MIN) / step; i++) {
    x_points[i] = step * i;
    y_points[i] = Math.log10(geoEvents.filter(item => Number(item.magnitude) >= x_points[i]).length);
    if (y_points[i] === 0) {
      break;
    }
  }
  console.log(y_points);

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
    x_predicted_plot[i] = MAGNITUDE_MIN + i * (MAGNITUDE_MAX - MAGNITUDE_MIN) / PREDICTED_PLOT_MAX_POINTS;
    y_predicted_plot[i] = beta_1_th + beta_2_th * x_predicted_plot[i];
  }

  const trace_function = {
    x: x_predicted_plot,
    y: y_predicted_plot,
    name: PREDICTED_FUNCTION_PLOT_NAME,
    mode: PREDICTED_FUNCTION_PLOT_MODE,
    type: PREDICTED_FUNCTION_PLOT_TYPE,
  }

  const [approximatedPoints, setApproximatedPoints] = useState({
    x: x_points,
    y: y_points,
    name: APPROXIMATED_POINTS_PLOT_NAME,
    mode: APPROXIMATED_POINTS_PLOT_MODE,
    type: APPROXIMATED_POINTS_PLOT_TYPE,
  });

  const [notApproximatedPoints, setNotApproximatedPoints] = useState({
    x: [],
    y: [],
    name: NOT_APPROXIMATED_POINTS_PLOT_NAME,
    mode: NOT_APPROXIMATED_POINTS_PLOT_MODE,
    type: NOT_APPROXIMATED_POINTS_PLOT_TYPE,
  });

  if (!geoEvents?.length) {
    return;
  }

  const plotTitle = `b-value: ${-beta_2_th.toFixed(3)}, a-value: ${beta_1_th.toFixed(3)}`;

  // TODO: подбирать b-value для фрагмента середины графика после среза начального и конечного фрагментов с низким коэффициентом наклона
  console.log(y_points);

  return (
  <Plot
    data={[approximatedPoints, notApproximatedPoints, trace_function]}
    layout={{
      width: 600,
      height: 400,
      title: plotTitle,
      xaxis: {
        title: "Magnitude",
        range: [MAGNITUDE_MIN, MAGNITUDE_MAX]},
      yaxis: {
        title: "Lg N",
        range: [0, 3]},
    }}
    onClick = {(data) => selectLastPointForApproximation(data, approximatedPoints, notApproximatedPoints, setApproximatedPoints, setNotApproximatedPoints)}
  />);
}