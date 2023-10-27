import Plot from "react-plotly.js";
import React, { useEffect, useMemo, useState } from "react";
import "../styles/b_value_graph_container.css";
import "../styles/content_cards.css";
import {
  DEFAULT_EXCLUDED_GEO_EVENT_FILL_COLOR,
  DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR,
} from "../lib/constants";
import { PositiveNumberInput } from "./PositiveNumberInput";

const MAGNITUDE_MIN = -1.3;
let MAGNITUDE_MAX = 3.3;

const NOT_APPROXIMATED_POINTS_PLOT_NAME = "points not used in approximation";
const NOT_APPROXIMATED_POINTS_PLOT_MODE = "markers";
const NOT_APPROXIMATED_POINTS_PLOT_TYPE = "scatter";

const APPROXIMATED_POINTS_PLOT_NAME = "points used in approximation";
const APPROXIMATED_POINTS_PLOT_MODE = "markers";
const APPROXIMATED_POINTS_PLOT_TYPE = "scatter";

const PREDICTED_FUNCTION_PLOT_NAME = "prediction";
const PREDICTED_FUNCTION_PLOT_MODE = "lines";
const PREDICTED_FUNCTION_PLOT_TYPE = "scatter";

const calculatePoints = (geoEvents, step) => {
  const y_points = [];
  const x_points = [];

  geoEvents.forEach((item) => {
    if (item.magnitude > MAGNITUDE_MAX) {
      MAGNITUDE_MAX = Number(item.magnitude);
    }
  });

  for (let i = 0; i < MAGNITUDE_MAX / step; i++) {
    x_points[i] = step * i;
    y_points[i] = Math.log10(
      geoEvents.filter((item) => Number(item.magnitude) >= x_points[i]).length
    );

    if (isNaN(y_points[i]) || !isFinite(y_points[i])) {
      y_points[i] = 0;
      break;
    }
  }

  return {
    x_points,
    y_points,
  };
};

const getYMeanValue = (y_points) => {
  return (y_points[0] + y_points[y_points.length - 1]) / 2;
};

const filterPoints = (
  x_points,
  y_points,
  selectedLowerPoint,
  selectedUpperPoint
) => {
  let included = { x: [], y: [] };
  let excluded = { x: [], y: [] };

  const yMean = getYMeanValue(y_points);

  for (let i = 0; i < y_points.length; i++) {
    if (
      (y_points[i] > yMean && x_points[i] < selectedUpperPoint.x) ||
      (y_points[i] < yMean && x_points[i] > selectedLowerPoint.x)
    ) {
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
    let yMean = getYMeanValue(y_points);

    if (clickedPoint.y > yMean) {
      setSelectedUpperPoint(clickedPoint);
    } else {
      setSelectedLowerPoint(clickedPoint);
    }
  };

  const [step, setStep] = useState(0.05);

  const [selectedLowerPoint, setSelectedLowerPoint] = useState({
    x: 100,
    y: 100000,
  });
  const [selectedUpperPoint, setSelectedUpperPoint] = useState({
    x: -1,
    y: -1,
  });

  const [predictedPlotData, setPredictedPlotData] = useState({
    x_predicted_plot: [],
    y_predicted_plot: [],
  });
  const [beta1, setBeta1] = useState();
  const [beta2, setBeta2] = useState();
  const [worker, setWorker] = useState(
    new Worker(new URL("../workers/b-valueWorker.js", import.meta.url))
  );

  const { x_points, y_points } = useMemo(
    () => calculatePoints(seismicEvents, step),
    [seismicEvents, step]
  );

  let filteredPoints = filterPoints(
    x_points,
    y_points,
    selectedLowerPoint,
    selectedUpperPoint
  );

  const handleWorkerMessage = (event) => {
    const { x_predicted_plot, y_predicted_plot, beta_1_th, beta_2_th } =
      event.data;
    setPredictedPlotData({ x_predicted_plot, y_predicted_plot });
    setBeta1(beta_1_th);
    setBeta2(beta_2_th);
  };

  useEffect(() => {
    worker.addEventListener("message", handleWorkerMessage);
    worker.postMessage({
      x_points: filteredPoints.included.x,
      y_points: filteredPoints.included.y,
      MAGNITUDE_MAX: MAGNITUDE_MAX,
      MAGNITUDE_MIN: MAGNITUDE_MIN,
    });
    return () => {
      worker.removeEventListener("message", handleWorkerMessage);
    };
  }, []);

  useEffect(() => {
    worker.postMessage({
      x_points: filteredPoints.included.x,
      y_points: filteredPoints.included.y,
      MAGNITUDE_MAX: MAGNITUDE_MAX,
      MAGNITUDE_MIN: MAGNITUDE_MIN,
    });
  }, [selectedUpperPoint, selectedLowerPoint]);

  const approximatedFunctionTrace = {
    x: predictedPlotData.x_predicted_plot,
    y: predictedPlotData.y_predicted_plot,
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

  let x_range_left = MAGNITUDE_MIN;
  let x_range_right = MAGNITUDE_MAX + 0.3;
  let y_range_bot = -0.3;
  let y_range_top =
    1.5 * Number(Math.log10(seismicEvents.length).toFixed(1)) + 0.3;

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
            range: [x_range_left, x_range_right],
            gridcolor: "gray",
            zerolinecolor: "green",
            tickmode: "linear",
            tick0: 0.5,
            dtick: 0.5,
            tickcolor: "transparent",
          },

          yaxis: {
            title: "Lg N",
            range: [y_range_bot, y_range_top],
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
          <p>b-value: {-beta2?.toFixed(3)}</p>
          <p>a-value: {beta1?.toFixed(3)}</p>
        </div>
        <div className="content_card_dark b_value_options">
          <div className="b_value_options_step">
            <p>Step to place points</p>
            <PositiveNumberInput initialValue={step} setValue={setStep} />
          </div>
        </div>
      </div>
    </div>
  );
};
