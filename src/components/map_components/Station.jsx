import {Marker, Popup} from "react-leaflet";
import L from "leaflet";

const getStationIcon = (_iconSize) => {
  return L.icon({
    iconUrl: "./icons/station.svg",
    iconSize: [_iconSize, _iconSize],
  });
}

export const Station = ({station}) => {
  return (
    <Marker position={[Number(station.latitude), Number(station.longitude)]} icon={getStationIcon(20)}>
      <Popup>
        <p> Station code: {station.code} </p>
        <p> Network code: {station.networkCode} </p>
        <p> longitude: {station.longitude} latitude: {station.latitude} </p>
        <p> elevation: {station.elevation} </p>
      </Popup>
    </Marker>
  )
}