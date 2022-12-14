import {CircleMarker, Marker, Popup, useMap} from "react-leaflet";
import L from "leaflet";
import {useEffect, useRef} from "react";
import {Popup as LeafletPopup} from 'leaflet';

const getGeoEventIcon = (_iconSize) => {
  return L.icon({
    iconUrl: "./icons/geo_event_icon.svg",
    iconSize: [_iconSize, _iconSize],
  });
}


export const GeoEvent = ({geoEvent}) => {
  // const popupRef = useRef();
  // const map = useMap();
  //
  // useEffect(() => {
  //
  //   console.log("fasfasdf");
  //   const popup = popupRef.current;
  //   if (!!popup && !!map) {
  //     map.openPopup(popup);
  //   }
  // }, [map, popupRef]);

  const pathOptions = {
    fillColor: "#fa2f2f",
    fillOpacity: 0.5,
    color: "black",
    weight: 1,
  };

  const selectedPathOptions = {
    fillColor: "blue",
    fillOpacity: 0.5,
    color: "black",
    weight: 1,
  };

  return (
    <CircleMarker center={[geoEvent.latitude, geoEvent.longitude]}
                  radius={geoEvent.magnitude > 0 ? 5 + geoEvent.magnitude * 3 : 5}
                  pathOptions={geoEvent?.selected ? selectedPathOptions : pathOptions}>
      <Popup>
        <p> Event type: {geoEvent.type} </p>
        <p> Date: {geoEvent.time} </p>
        <p> Magnitude: {geoEvent.magnitude} {geoEvent.magnitudeType} </p>
        <p> longitude: {geoEvent.longitude} latitude: {geoEvent.latitude} </p>
        {geoEvent.networkCode &&
          <p> Network code: {geoEvent.networkCode} </p>
        }
        {geoEvent.depth &&
          <span> Depth: {geoEvent.depth} {geoEvent.depthType}</span>
        }
        {geoEvent.depthUncertainty &&
        <span>, uncertainty: {geoEvent.depthUncertainty} </span>}
      </Popup>
    </CircleMarker>)
}