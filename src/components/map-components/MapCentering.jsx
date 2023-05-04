import {useMap} from "react-leaflet";

const STANDARD_ZOOM = 12;

export const MapCentering = (center) => {
  const map = useMap();
  map.flyTo([center.longitude, center.latitude], STANDARD_ZOOM);
}