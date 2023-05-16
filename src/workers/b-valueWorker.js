const MAGNITUDE_MIN = -1.3;
const MAGNITUDE_MAX = 3.3;
const PREDICTED_PLOT_MAX_POINTS = 200;

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

const performHeavyTask = (data) => {
  return approximate(data.x_points, data.y_points);
};

self.addEventListener("message", (event) => {
  const result = performHeavyTask(event.data);
  self.postMessage(result);
});
