import React, { useState } from "react";
import { Polygon, Polyline, useMapEvents } from "react-leaflet";
import { getParallelPolygon } from "../../lib/parallel";
import L from "leaflet";

export const ProfileCreator = ({ profiles, setProfiles }) => {
  const [clickPositions, setClickPositions] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [currentMousePos, setCurrentMousePos] = useState(null);

  const popLastArray = (array) => {
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
        const l = clickPositions.length;
        setProfiles((prev) => {
          return [
            ...prev,
            {
              positions: [clickPositions[l - 1], e.latlng],
              width: 2,
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
          setClickPositions(popLastArray(clickPositions));
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
      if (
        enabled &&
        (e.originalEvent.key === "D" || e.originalEvent.key === "d")
      ) {
        if (clickPositions.length % 2 !== 0) {
          setClickPositions(popLastArray(clickPositions));
        } else {
          setProfiles((prev) => popLastArray(prev));
        }
      }
    },
    mousemove: (e) => {
      if (!map) return;
      setCurrentMousePos(e.latlng);
    },
  });

  // let lines = [];
  // for (let i = 0; i < clickPositions.length - 1; i += 2) {
  //   lines.push([clickPositions[i], clickPositions[i + 1]]);
  // }

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
      {profiles?.length > 0 &&
        profiles.map((item, index) => (
          <>
            <Polyline positions={item.positions} key={index} color="red" />
            <Polygon
              positions={getParallelPolygon(
                item.positions[0],
                item.positions[1],
                item.width
              )}
              key={index + 10000}
            />
          </>
        ))}
    </>
  );
};
