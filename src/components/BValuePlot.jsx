import Plot from "react-plotly.js";
import React from "react";

const MAGNITUDE_MIN = -1.5;
const MAGNITUDE_MAX = 3;
const PREDICTED_PLOT_MAX_DOTS = 200;

export const BValuePlot = ({geoEvents, step}) => {
  if (!geoEvents?.length) {
    return;
  }

  const y_dots = [];
  const x_dots = [];

  for (let i = 0; i < (MAGNITUDE_MAX - MAGNITUDE_MIN) / step; i++) {
    x_dots[i] = step * i;
    y_dots[i] = Math.log10(geoEvents.filter(item => item.magnitude >= x_dots[i]).length);
    if (y_dots[i] === 0) {
      break;
    }
  }

  const x_sum = x_dots.reduce((prev, cur) => prev + cur, 0);
  const y_sum = y_dots.reduce((prev, cur) => prev + cur, 0);
  const x_mean = x_sum / x_dots.length;
  const y_mean = y_sum / y_dots.length;

  // function
  // f(M) = lg(N) = a - b * M
  // theory:
  // y_i = beta_1 + beta_2 * x_i

  let beta_2_th_numerator = 0;
  let beta_2_th_denominator = 0;
  for (let i = 0; i < y_dots.length; i++) {
    beta_2_th_numerator += (y_dots[i] - y_mean) * (x_dots[i] - x_mean);
    beta_2_th_denominator += (x_dots[i] - x_mean) * (x_dots[i] - x_mean);
  }

  const beta_2_th = beta_2_th_numerator / beta_2_th_denominator; // b-value
  const beta_1_th = y_mean - beta_2_th * x_mean; // a-value

  const trace_dots = {
    x: x_dots,
    y: y_dots,
    name: "actual events",
    mode: 'markers',
    type: 'scatter'
  };

  let x_predicted_plot = [];
  let y_predicted_plot = [];
  for (let i = 0; i < PREDICTED_PLOT_MAX_DOTS; i++) {
    x_predicted_plot[i] = MAGNITUDE_MIN + i * (MAGNITUDE_MAX - MAGNITUDE_MIN) / PREDICTED_PLOT_MAX_DOTS;
    y_predicted_plot[i] = beta_1_th + beta_2_th * x_predicted_plot[i];
  }

  const trace_function = {
    x: x_predicted_plot,
    y: y_predicted_plot,
    name: "prediction",
    mode: 'lines',
    type: 'scatter'
  }

  const plotTitle = `b-value: ${beta_2_th.toFixed(3)}, a-value: ${beta_1_th.toFixed(3)}`;

  // TODO: график по оси x время, y - M
  // TODO: ось y у графика G должна быть логарифмирована, подбирать b-value для фрагмента середины графика после среза начального и конечного фрагментов с низким коэффициентом наклона
  // TODO: шаг проверки ивентов на графике b-value должен выбираться пользователем

  return (
  <Plot
    data={[trace_dots, trace_function]}
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
  />);
}