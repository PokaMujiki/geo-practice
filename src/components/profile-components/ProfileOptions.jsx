import { TextFieldLeftCaption } from "../TextFieldLeftCaption";
import L from "leaflet";
import { getParallelPolygon } from "../../lib/parallel";
import React from "react";
import { pointsInParallelPolygon } from "./ProfileHelpers";

export const ProfileOptions = ({
  profiles,
  setProfiles,
  geoEvents,
  profileIndex,
}) => {
  const currentProfile = profiles[profileIndex];
  const width = currentProfile.width;

  let profilePoints = pointsInParallelPolygon(currentProfile, geoEvents);

  const setWidth = (value) => {
    let updatedProfiles = [...profiles];
    updatedProfiles[profileIndex].width = value;
    setProfiles(updatedProfiles);
  };

  return (
    <div className="profile_options content_card_dark">
      <TextFieldLeftCaption
        type="number"
        value={width}
        setValue={setWidth}
        caption="Profile width in meters: "
      />
      <p>profile contains {profilePoints.length} events</p>
    </div>
  );
};
