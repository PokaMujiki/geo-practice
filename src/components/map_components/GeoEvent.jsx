import {Marker, Popup} from "react-leaflet";
import L from "leaflet";

const getGeoEventIcon = (_iconSize) => {
  return L.icon({
    iconUrl: "./icons/geo_event_icon.svg",
    iconSize: [_iconSize, _iconSize],
  });
}

export const GeoEvent = ({geoEvent}) => {
  return (
    <Marker position={[geoEvent.latitude, geoEvent.longitude]} icon={getGeoEventIcon(10 + geoEvent.magnitude * 3)}>
      <Popup>
        <p> Event type: {geoEvent.type} </p>
        <p> Date: {geoEvent.time} </p>
        <p> Magnitude: {geoEvent.magnitude}({geoEvent.magnitudeType}) </p>
        <p> longitude: {geoEvent.longitude} latitude: {geoEvent.latitude} </p>
        <p> Network code: {geoEvent.networkCode} </p>
        <p> Depth: {geoEvent.depth}({geoEvent.depthType}, uncertainty: {geoEvent.depthUncertainty}) </p>
      </Popup>
    </Marker>)
}