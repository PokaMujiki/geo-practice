import { Polygon, Polyline } from "react-leaflet";
import React from "react";

export const Profile = ({ profiles, profileIndex }) => {
  const currentProfile = profiles[profileIndex];

  return (
    <>
      <Polyline positions={currentProfile.positions} color="red" />
      <Polygon positions={currentProfile.polygonPositions} />
    </>
  );
};
