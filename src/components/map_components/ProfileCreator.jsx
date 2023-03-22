import React, { useEffect, useState } from "react";
import { Polyline, useMap, useMapEvents } from "react-leaflet";

export const ProfileCreator = () => {
  const [clickPositions, setClickPositions] = useState([]);
  const [enabled, setEnabled] = useState(false);

  const map = useMapEvents({
    click: (e) => {
      if (!map) return;
      if (enabled) {
        setClickPositions((prevPositions) => [...prevPositions, e.latlng]);
      }
    },
    keypress: (e) => {
      if (!map) return;
      if (e.originalEvent.key === "P" || e.originalEvent.key === "p") {
        if (enabled && clickPositions.length % 2 !== 0) {
          const [, ...rest] = clickPositions.reverse();
          const withoutLast = rest.reverse();
          setClickPositions(withoutLast);
        }
        setEnabled((prevState) => !prevState);
      }
    },
  });

  let lines = [];
  for (let i = 0; i < clickPositions.length - 1; i += 2) {
    lines.push([clickPositions[i], clickPositions[i + 1]]);
  }

  return (
    <>
      {lines?.map((item, index) => (
        <Polyline positions={item} color="red" key={index} />
      ))}
    </>
  );
};
