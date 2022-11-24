import Plot from "react-plotly.js";
import React, {useEffect, useState} from "react";

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
  (data, approximatedPoints, notApproximatedPoints) => {
  let useInApproximation_x = [];
  let useInApproximation_y = [];
  let notUseInApproximation_x = [];
  let notUseInApproximation_y = [];

  const all_y = approximatedPoints.y.concat(notApproximatedPoints.y);
  const all_x = approximatedPoints.x.concat(notApproximatedPoints.x);

  for (let i = 0; i < all_y.length; i++) {
    if (data.points[0].x <= all_x[i]) {
      useInApproximation_y.push(all_y[i]);
      useInApproximation_x.push(all_x[i]);
    }
    else {
      notUseInApproximation_y.push(all_y[i]);
      notUseInApproximation_x.push(all_x[i]);
    }
  }

  console.log(useInApproximation_x)
  console.log(useInApproximation_y)
  console.log(notUseInApproximation_x)
  console.log(notUseInApproximation_y);

  return { useInApproximation_y, useInApproximation_x, notUseInApproximation_y, notUseInApproximation_x }
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
  let { x_points, y_points } = calculatePoint(geoEvents, step);
  let { x_predicted_plot, y_predicted_plot, beta_1_th, beta_2_th } = approximate(x_points, y_points);
  console.log("x_points")
  console.log(x_points)
  console.log("y_points")
  console.log(y_points)

  const [beta1_th, setBeta1_th] = useState(beta_1_th);
  const [beta2_th, setBeta2_th] = useState(beta_2_th);

  const [trace_function, setTrace_function] = useState({
    x: x_predicted_plot,
    y: y_predicted_plot,
    name: PREDICTED_FUNCTION_PLOT_NAME,
    mode: PREDICTED_FUNCTION_PLOT_MODE,
    type: PREDICTED_FUNCTION_PLOT_TYPE,
  });

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

  const plotTitle = `b-value: ${-beta2_th.toFixed(3)}, a-value: ${beta1_th.toFixed(3)}`;

  useEffect(() => {

  }, [])

  // TODO: подбирать b-value для фрагмента середины графика после среза начального и конечного фрагментов с низким коэффициентом наклона

  if (!geoEvents.length) {
    return;
  }

  console.log("graphics data")
  console.log(approximatedPoints)
  console.log(notApproximatedPoints)
  console.log(trace_function)
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
      const newDatasets = splitDatasets(data, approximatedPoints, notApproximatedPoints);
      setApproximatedPoints({
        x: newDatasets.useInApproximation_x,
        y: newDatasets.useInApproximation_y,
        name: APPROXIMATED_POINTS_PLOT_NAME,
        mode: APPROXIMATED_POINTS_PLOT_MODE,
        type: APPROXIMATED_POINTS_PLOT_TYPE,
      });
      setNotApproximatedPoints({
        x: newDatasets.notUseInApproximation_x,
        y: newDatasets.notUseInApproximation_y,
        name: NOT_APPROXIMATED_POINTS_PLOT_NAME,
        mode: NOT_APPROXIMATED_POINTS_PLOT_MODE,
        type: NOT_APPROXIMATED_POINTS_PLOT_TYPE,
      });
      const approximated = approximate(newDatasets.useInApproximation_x, newDatasets.useInApproximation_y);
      setTrace_function({
        x: approximated.x_predicted_plot,
        y: approximated.y_predicted_plot,
        name: PREDICTED_FUNCTION_PLOT_NAME,
        mode: PREDICTED_FUNCTION_PLOT_MODE,
        type: PREDICTED_FUNCTION_PLOT_TYPE,
      });
      setBeta1_th(approximated.beta_1_th);
      setBeta2_th(approximated.beta_2_th)
    }}
  />);
}