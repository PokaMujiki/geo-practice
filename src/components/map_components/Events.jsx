import {useMap} from "react-leaflet";
import L from "leaflet";

export const Events = (geoEvents) => {
  const map = useMap();
  if (geoEvents.length) {
    const overlays = {
      'GeoEvents': geoEvents,
    };

    const markers = geoEvents?.map(geoEvent => L.marker([geoEvent.latitude, geoEvent.latitude]).bindPopup(geoEvent.depth).addTo(events));
    const events = L.layerGroup(markers).addTo(map);
  }
  return;
}