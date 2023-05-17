import Plot from "react-plotly.js";
import React, { useEffect, useMemo, useState } from "react";
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
    selectedRightPoint,
    selectedLeftPoint
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
    });
    return () => {
      worker.removeEventListener("message", handleWorkerMessage);
    };
  }, []);

  useEffect(() => {
    worker.postMessage({
      x_points: filteredPoints.included.x,
      y_points: filteredPoints.included.y,
    });
  }, [selectedLeftPoint, selectedRightPoint]);

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
          <p>b-value: {-beta2?.toFixed(3)}</p>
          <p>a-value: {beta1?.toFixed(3)}</p>
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
