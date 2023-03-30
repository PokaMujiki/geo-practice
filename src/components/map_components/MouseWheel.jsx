import { useMapEvents } from "react-leaflet";

export const MouseWheelEnableOnFocus = () => {
  const map = useMapEvents({
    focus: () => {
      if (!map) return;
      console.log("map focus");
      map.scrollWheelZoom.enable();
    },
    blur: () => {
      if (!map) return;
      console.log("map blur");
      map.scrollWheelZoom.disable();
    },
  });
  return null;
};
