import Plot from "react-plotly.js";
import React from "react";
import {MAX_DOTS} from "../lib/constants";

export const BValuePlot = ({geoEvents, b_value}) => {
  if (!geoEvents?.length) {
    return;
  }

  let plotTitle = `Gutenberg–Richter law for ${geoEvents.length} selected events`;
  
  if (geoEvents.length <= 1) {
    plotTitle = `Gutenberg–Richter law for ${geoEvents.length} selected event`;
  }

  const y_axis = [];
  const x_axis = [];
  for (let i = 0; i < 20; i++) {
    y_axis[i] = geoEvents.filter(item => item.magnitude >= 0.5 * i).length / geoEvents.length;
    x_axis[i] = i / 2;
    if (y_axis[i] === 0) {
      break;
    }
  }

  const user_y_axis = [];
  const user_x_axis = [];
  for (let i = 0; i < MAX_DOTS; i++) {
    user_x_axis[i] = i * 10 / MAX_DOTS;
    user_y_axis[i] = Math.pow(10,-b_value * user_x_axis[i]);
  }

  const trace_dots = {
    x: x_axis,
    y: y_axis,
    name: "actual events",
    mode: 'markers',
    type: 'scatter'
  };

  const trace_function = {
    x: user_x_axis,
    y: user_y_axis,
    name: "user prediction",
    mode: 'lines',
    type: 'scatter'
  }
  // TODO: график по оси x время, y - M
  // TODO: ось y у графика G должна быть логарифмирована, подбирать b-value для фрагмента середины графика после среза начального и конечного фрагментов с низким коэффициентом наклона
  // TODO: попросить загрузить новые ивенты
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
        range: [0, 4]},
      yaxis: {
        title: "Occurrences, N : N_total",
        range: [0, 1]},
    }}
  />);
}