import { useMapEvents } from "react-leaflet";

export const MouseWheelEnableOnFocus = () => {
  const map = useMapEvents({
    focus: () => {
      if (!map) return;
      map.scrollWheelZoom.enable();
    },
    blur: () => {
      if (!map) return;
      map.scrollWheelZoom.disable();
    },
  });
  return null;
};
