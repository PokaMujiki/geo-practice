import { CircleMarker, Popup } from "react-leaflet";
import {
  DEFAULT_GEO_EVENT_FILL_COLOR,
  DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR,
} from "../../lib/constants";
import { toNormalDate, toNormalTime } from "../../lib/helpers";

export const GeoEvent = ({ geoEvent, isSelected }) => {
  const pathOptions = {
    fillColor: DEFAULT_GEO_EVENT_FILL_COLOR,
    fillOpacity: 0.5,
    color: "black",
    weight: 1,
  };

  const selectedPathOptions = {
    fillColor: DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR,
    fillOpacity: 0.5,
    color: "black",
    weight: 1,
  };

  return (
    <CircleMarker
      center={[geoEvent.latitude, geoEvent.longitude]}
      radius={geoEvent.magnitude > 0 ? 5 + Number(geoEvent.magnitude) : 5}
      pathOptions={isSelected ? selectedPathOptions : pathOptions}
    >
      <Popup>
        <p> Event type: {geoEvent.type} </p>
        <p>
          {" "}
          Date: {toNormalDate(geoEvent.time)} {toNormalTime(geoEvent.time)}
        </p>
        <p>
          {" "}
          Magnitude: {geoEvent.magnitude} {geoEvent.magnitudeType}{" "}
        </p>
        <p>
          {" "}
          longitude: {geoEvent.longitude} latitude: {geoEvent.latitude}{" "}
        </p>
        {geoEvent.networkCode && <p> Network code: {geoEvent.networkCode} </p>}
        {geoEvent.depth && (
          <span>
            {" "}
            Depth: {geoEvent.depth} {geoEvent.depthType}
          </span>
        )}
        {geoEvent.depthUncertainty && (
          <span>, uncertainty: {geoEvent.depthUncertainty} </span>
        )}
      </Popup>
    </CircleMarker>
  );
};
