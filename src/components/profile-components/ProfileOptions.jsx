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

  let eventsNoDepthDataCount = 0;
  let eventsNoUncertaintyDataCount = 0;

  for (let i = 0; i < profilePoints.length; i++) {
    if (!profilePoints[i].depth) {
      eventsNoDepthDataCount++;
      eventsNoUncertaintyDataCount++;
    } else if (!profilePoints[i].depthUncertainty) {
      eventsNoUncertaintyDataCount++;
    }
  }

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
      <p>Profile contains {profilePoints.length} events</p>
      <p>{eventsNoDepthDataCount} events have no depth data</p>
      <p>
        {eventsNoUncertaintyDataCount} events have no depth uncertainty data
      </p>
    </div>
  );
};
