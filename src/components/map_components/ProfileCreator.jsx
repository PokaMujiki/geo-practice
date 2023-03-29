import React, { useState } from "react";
import { Polygon, Polyline, useMapEvents } from "react-leaflet";
import { getParallelPolygon } from "../../lib/parallel";

export const ProfileCreator = ({ profiles, setProfiles }) => {
  const [clickPositions, setClickPositions] = useState([]);
  const [enabled, setEnabled] = useState(false);

  const map = useMapEvents({
    click: (e) => {
      if (!map) return;
      if (enabled) {
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
      }
      setClickPositions((prevPositions) => [...prevPositions, e.latlng]);
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

  // let lines = [];
  // for (let i = 0; i < clickPositions.length - 1; i += 2) {
  //   lines.push([clickPositions[i], clickPositions[i + 1]]);
  // }

  return (
    <>
      {/*{lines?.map((item, index) => (*/}
      {/*  <>*/}
      {/*    <Polyline positions={item} color="red" key={index} />*/}
      {/*    <Polygon*/}
      {/*      positions={getParallelPolygon(item[0], item[1], 2)}*/}
      {/*      color="blue"*/}
      {/*    />*/}
      {/*  </>*/}
      {/*))}*/}
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
            />
          </>
        ))}
    </>
  );
};
