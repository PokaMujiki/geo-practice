import { ProfileOptions } from "./ProfileOptions";
import { ProfilePlot } from "./ProfilePlot";
import turf from "turf";
import { leafletPolygonPos2TurfPolygonPos } from "./ProfileHelpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { useState } from "react";

export const ProfileContainer = ({
  profiles,
  setProfiles,
  profileIndex,
  geoEvents,
}) => {
  const [showUncertainty, setShowUncertainty] = useState(true);
  const currentProfile = profiles[profileIndex];

  const polygon = turf.polygon([
    leafletPolygonPos2TurfPolygonPos(currentProfile.polygonPositions),
  ]);

  const profileEvents = [];
  geoEvents.map((item) => {
    if (
      booleanPointInPolygon(
        turf.point([item.longitude, item.latitude]),
        polygon
      )
    ) {
      profileEvents.push(item);
    }
  });

  return (
    <div className="profile_wrapper">
      <ProfileOptions
        profiles={profiles}
        setProfiles={setProfiles}
        profileEvents={profileEvents}
        profileIndex={profileIndex}
        showUncertainty={showUncertainty}
        setShowUncertainty={setShowUncertainty}
      />
      <ProfilePlot
        profileInfo={currentProfile}
        profileEvents={profileEvents}
        showUncertainty={showUncertainty}
      />
    </div>
  );
};
