import SelectArea from "leaflet-area-select";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

export const SelectMapArea = ({ geoEvents, setSelectedGeoEvents }) => {
  let map = useMap();

  useEffect(() => {
    if (!map) return;

    map.selectArea.enable();
  }, [map]);

  const selected = [];

  map.on("areaselected", (e) => {
    const properBounds = L.latLngBounds([
      e.bounds._northEast,
      e.bounds._southWest,
    ]);

    geoEvents.map((item) => {
      if (properBounds.contains(L.latLng([item.latitude, item.longitude]))) {
        selected.push(item);
      }
    });

    setSelectedGeoEvents(selected);
  });

  return null;
};
