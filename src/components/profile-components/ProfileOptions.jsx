import { TextFieldLeftCaption } from "../TextFieldLeftCaption";
import React, { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import L from "leaflet";

export const ProfileOptions = ({
  profiles,
  setProfiles,
  geoEvents,
  profileIndex,
}) => {
  const currentProfile = profiles[profileIndex];
  const [width, setWidth] = useState(currentProfile.width);

  const debouncedWidth = useDebounce(width, 750);

  useEffect(() => {
    let updatedProfiles = [...profiles];
    updatedProfiles[profileIndex].width = debouncedWidth;
    setProfiles(updatedProfiles);
  }, [debouncedWidth]);

  if (!currentProfile?.bounds) return;

  let eventsNoDepthDataCount = 0;
  let eventsNoUncertaintyDataCount = 0;

  const profileEvents = [];

  geoEvents.map((item) => {
    if (
      currentProfile.bounds.contains(L.latLng(item.latitude, item.longitude))
    ) {
      profileEvents.push(item);
    }
  });

  console.log(profileEvents);

  for (let i = 0; i < profileEvents.length; i++) {
    if (!profileEvents[i].depth) {
      eventsNoDepthDataCount++;
      eventsNoUncertaintyDataCount++;
    } else if (!profileEvents[i].depthUncertainty) {
      eventsNoUncertaintyDataCount++;
    }
  }

  console.log(
    profileEvents.map((item) => {
      console.log(
        profiles[profileIndex].bounds.contains(
          L.latLng(item.latitude, item.longitude)
        )
      );
    })
  );

  return (
    <div className="profile_options content_card_dark">
      <TextFieldLeftCaption
        type="number"
        value={width}
        setValue={setWidth}
        caption="Profile width(km): "
      />
      <p>Profile contains {profileEvents.length} events</p>
      <p>{eventsNoDepthDataCount} events have no depth data</p>
      <p>
        {eventsNoUncertaintyDataCount} events have no depth uncertainty data
      </p>
    </div>
  );
};
