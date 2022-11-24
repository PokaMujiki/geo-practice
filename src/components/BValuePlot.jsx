import Plot from "react-plotly.js";
import React, { useEffect, useMemo, useState } from "react";

const MAGNITUDE_MIN = -1.5;
const MAGNITUDE_MAX = 3;
const PREDICTED_PLOT_MAX_POINTS = 200;

const NOT_APPROXIMATED_POINTS_PLOT_NAME = "points not used in approximation";
const NOT_APPROXIMATED_POINTS_PLOT_MODE = "markers";
const NOT_APPROXIMATED_POINTS_PLOT_TYPE = "scatter";

const APPROXIMATED_POINTS_PLOT_NAME = "points used in approximation";
const APPROXIMATED_POINTS_PLOT_MODE = "markers";
const APPROXIMATED_POINTS_PLOT_TYPE = "scatter";

const PREDICTED_FUNCTION_PLOT_NAME = "prediction";
const PREDICTED_FUNCTION_PLOT_MODE = "lines";
const PREDICTED_FUNCTION_PLOT_TYPE = "scatter"

const splitDatasets =
  (point, all_y, all_x) => {
    let useInApproximation_x = [];
    let useInApproximation_y = [];
    let notUseInApproximation_x = [];
    let notUseInApproximation_y = [];

    for (let i = 0; i < all_y.length; i++) {
      if (point.x <= all_x[i]) {
        useInApproximation_y.push(all_y[i]);
        useInApproximation_x.push(all_x[i]);
      }
      else {
        notUseInApproximation_y.push(all_y[i]);
        notUseInApproximation_x.push(all_x[i]);
      }
    }

    return { useInApproximation_y, useInApproximation_x, notUseInApproximation_y, notUseInApproximation_x };
  }

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
    x_predicted_plot[i] = MAGNITUDE_MIN + i * (MAGNITUDE_MAX - MAGNITUDE_MIN) / PREDICTED_PLOT_MAX_POINTS;
    y_predicted_plot[i] = beta_1_th + beta_2_th * x_predicted_plot[i];
  }

  return {
    x_predicted_plot,
    y_predicted_plot,
    beta_1_th,
    beta_2_th,
  }
}

const calculatePoint = (geoEvents, step) => {
  const y_points = [];
  const x_points = [];

  for (let i = 0; i < (MAGNITUDE_MAX - MAGNITUDE_MIN) / step; i++) {
    x_points[i] = step * i;
    y_points[i] = Math.log10(geoEvents.filter(item => Number(item.magnitude) >= x_points[i]).length);
    if (y_points[i] === 0) {
      break;
    }
  }
  return {
    x_points,
    y_points,
  }
}

export const BValuePlot = ({geoEvents, step}) => {
  const { x_points, y_points } = useMemo(() => calculatePoint(geoEvents, step), [geoEvents, step]);
  let { x_predicted_plot, y_predicted_plot, beta_1_th, beta_2_th } = approximate(x_points, y_points);
  let x_use = x_points;
  let y_use = y_points;
  let x_notUse = [];
  let y_notUse = [];

  const [x_trace, setX_trace] = useState(x_predicted_plot);
  const [y_trace, setY_trace] = useState(y_predicted_plot);

  const[x_useInApproximation, setX_useInApproximation] = useState(x_use);
  const[y_useInApproximation, setY_useInApproximation] = useState(y_use);

  const[x_notUseInApproximation, setX_notUseInApproximation] = useState(x_notUse);
  const[y_notUseInApproximation, setY_notUseInApproximation] = useState(y_notUse);

  const [beta1_th, setBeta1_th] = useState(beta_1_th);
  const [beta2_th, setBeta2_th] = useState(beta_2_th);

  const [selectedPoint, setSelectedPoint] = useState({x: 0, y: 0});

  useEffect(() => {
    const dataset = splitDatasets(selectedPoint, y_points, x_points);
    setX_useInApproximation(dataset.useInApproximation_x);
    setY_useInApproximation(dataset.useInApproximation_y);

    setX_notUseInApproximation(dataset.notUseInApproximation_x);
    setY_notUseInApproximation(dataset.notUseInApproximation_y);

    const approximated = approximate(dataset.useInApproximation_x, dataset.useInApproximation_y);

    setX_trace(approximated.x_predicted_plot);
    setY_trace(approximated.y_predicted_plot);

    setBeta1_th(approximated.beta_1_th);
    setBeta2_th(approximated.beta_2_th);
  }, [selectedPoint, step, geoEvents, x_points, y_points]);

  const plotTitle = `b-value: ${-beta2_th.toFixed(3)}, a-value: ${beta1_th.toFixed(3)}`;

  const trace_function = {
    x: x_trace,
    y: y_trace,
    name: PREDICTED_FUNCTION_PLOT_NAME,
    mode: PREDICTED_FUNCTION_PLOT_MODE,
    type: PREDICTED_FUNCTION_PLOT_TYPE,
  };

  const approximatedPoints= {
    x: x_useInApproximation,
    y: y_useInApproximation,
    name: APPROXIMATED_POINTS_PLOT_NAME,
    mode: APPROXIMATED_POINTS_PLOT_MODE,
    type: APPROXIMATED_POINTS_PLOT_TYPE,
  };

  const notApproximatedPoints = {
    x: x_notUseInApproximation,
    y: y_notUseInApproximation,
    name: NOT_APPROXIMATED_POINTS_PLOT_NAME,
    mode: NOT_APPROXIMATED_POINTS_PLOT_MODE,
    type: NOT_APPROXIMATED_POINTS_PLOT_TYPE,
  };


  // TODO: подбирать b-value для фрагмента середины графика после среза начального и конечного фрагментов с низким коэффициентом наклона

  if (!geoEvents.length) {
    return;
  }

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
      onClick = {(data) => {
        setSelectedPoint({ x: data.points[0].x, y: data.points[0].y});
      }}
    />);
}