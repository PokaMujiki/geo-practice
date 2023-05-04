import { Polygon, Polyline } from "react-leaflet";
import React, { useEffect, useRef } from "react";
import { getParallelPolygon } from "../../lib/parallel";

export const Profile = ({ profiles, setProfiles, profileIndex }) => {
  const polygonRef = useRef();

  useEffect(() => {
    const bounds = polygonRef?.current?.getBounds();

    if (!bounds) {
      return;
    }

    const newProfiles = profiles;
    newProfiles[profileIndex].bounds = bounds;

    setProfiles(newProfiles);
  }, [profiles]);

  const currentProfile = profiles[profileIndex];

  return (
    <>
      <Polyline positions={currentProfile.positions} color="red" />
      <Polygon
        positions={getParallelPolygon(
          currentProfile.positions[0],
          currentProfile.positions[1],
          currentProfile.width
        )}
        ref={polygonRef}
      />
    </>
  );
};
