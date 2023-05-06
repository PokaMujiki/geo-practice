import React, { useState } from "react";
import { Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { getParallelPolygon } from "../../lib/parallel";

export const ProfileCreator = ({ setProfiles }) => {
  const [clickPositions, setClickPositions] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [currentMousePos, setCurrentMousePos] = useState(null);

  const popLast = (array) => {
    if (!array.length) {
      return [];
    }
    const [, ...rest] = array.reverse();
    return rest.reverse();
  };

  const map = useMapEvents({
    click: (e) => {
      if (!map || !enabled) return;

      if (clickPositions.length % 2 === 1) {
        // add new profile
        const l = clickPositions.length;
        setProfiles((prev) => {
          const profileDefaultWidth = 2;
          const polygonPositions = getParallelPolygon(
            clickPositions[l - 1],
            e.latlng,
            profileDefaultWidth
          );

          return [
            ...prev,
            {
              positions: [clickPositions[l - 1], e.latlng],
              width: 2,
              polygonPositions: polygonPositions,
            },
          ];
        });
      }

      setClickPositions((prevPositions) => [...prevPositions, e.latlng]);
    },
    keypress: (e) => {
      if (!map) return;

      // enter/leave creating profiles mode
      if (e.originalEvent.key === "P" || e.originalEvent.key === "p") {
        if (enabled && clickPositions.length % 2 !== 0) {
          setClickPositions(popLast(clickPositions));
        }
        // change cursor
        if (!enabled) {
          // enabled has old state now
          L.DomUtil.addClass(map._container, "crosshair-cursor-enabled");
        } else {
          L.DomUtil.removeClass(map._container, "crosshair-cursor-enabled");
        }
        setEnabled((prevState) => !prevState);
      }

      // if has clicked position without profile, removes it, else removes last profile
      // profile remover
      if (
        enabled &&
        (e.originalEvent.key === "D" || e.originalEvent.key === "d")
      ) {
        if (clickPositions.length % 2 !== 0) {
          setClickPositions(popLast(clickPositions));
        } else {
          setProfiles((prev) => popLast(prev));
        }
      }
    },
    mousemove: (e) => {
      if (!map) return;
      setCurrentMousePos(e.latlng);
    },
  });

  return (
    <>
      {clickPositions.length % 2 !== 0 && currentMousePos && (
        <Polyline
          positions={[
            clickPositions[clickPositions.length - 1],
            currentMousePos,
          ]}
          color="blue"
          key={Number.MAX_VALUE}
        />
      )}
    </>
  );
};
