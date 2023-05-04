import { CircleMarker, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { Popup as LeafletPopup } from "leaflet";
import {
  DEFAULT_GEO_EVENT_FILL_COLOR,
  DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR,
} from "../../lib/constants";
import { toNormalDate, toNormalTime } from "../../lib/helpers";

export const GeoEvent = ({ geoEvent, isSelected }) => {
  // const popupRef = useRef();
  // const map = useMap();
  //
  // useEffect(() => {
  //
  //   const popup = popupRef.current;
  //   if (!!popup && !!map) {
  //     map.openPopup(popup);
  //   }
  // }, [map, popupRef]);

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

  // todo: better css

  return (
    <CircleMarker
      center={[geoEvent.latitude, geoEvent.longitude]}
      radius={geoEvent.magnitude > 0 ? 5 + geoEvent.magnitude * 3 : 5}
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
