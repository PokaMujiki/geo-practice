import { Marker, Polygon, Polyline } from "react-leaflet";
import React from "react";
import L from "leaflet";
import "../../styles/marker_label.css";

export const Profile = ({ profiles, profileIndex }) => {
  const currentProfile = profiles[profileIndex];

  const startMarker = L.divIcon({
    className: "marker_label",
    html: currentProfile.profileNames[0],
  });
  const endMarker = L.divIcon({
    className: "marker_label",
    html: currentProfile.profileNames[1],
  });

  return (
    <>
      <Polyline positions={currentProfile.positions} color="red" />
      <Marker position={currentProfile.positions[0]} icon={startMarker} />
      <Marker position={currentProfile.positions[1]} icon={endMarker} />
      <Polygon positions={currentProfile.polygonPositions} />
    </>
  );
};
