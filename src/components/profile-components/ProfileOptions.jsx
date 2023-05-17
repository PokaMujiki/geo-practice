import { TextFieldLeftCaption } from "../TextFieldLeftCaption";
import React, { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { getParallelPolygon } from "../../lib/parallel";
import { isPositiveNumber } from "../../lib/helpers";

export const ProfileOptions = ({
  profiles,
  setProfiles,
  profileEvents,
  profileIndex,
  showUncertainty,
  setShowUncertainty,
}) => {
  const currentProfile = profiles[profileIndex];
  const [width, setWidth] = useState(currentProfile.width);

  const debouncedWidth = useDebounce(width, 750);

  useEffect(() => {
    const polygonPositions = getParallelPolygon(
      currentProfile.positions[0],
      currentProfile.positions[1],
      debouncedWidth
    );

    let updatedProfiles = [...profiles];
    updatedProfiles[profileIndex].polygonPositions = polygonPositions;
    updatedProfiles[profileIndex].width = debouncedWidth;
    setProfiles(updatedProfiles);
  }, [debouncedWidth]);

  let eventsNoDepthDataCount = 0;
  let eventsNoUncertaintyDataCount = 0;

  for (let i = 0; i < profileEvents.length; i++) {
    if (!profileEvents[i].depth) {
      eventsNoDepthDataCount++;
      eventsNoUncertaintyDataCount++;
    } else if (!profileEvents[i].depthUncertainty) {
      eventsNoUncertaintyDataCount++;
    }
  }

  return (
    <div className="profile_options content_card_dark">
      <TextFieldLeftCaption
        type="number"
        value={width}
        onChange={(e) =>
          isPositiveNumber(e.target.value) ? setWidth(e.target.value) : null
        }
        caption="Profile width(km): "
      />
      <p>Profile contains {profileEvents.length} events</p>
      <p>{eventsNoDepthDataCount} events have no depth data</p>
      <p>
        {eventsNoUncertaintyDataCount} events have no depth uncertainty data
      </p>
      <span>
        <input
          type="checkbox"
          checked={showUncertainty}
          onChange={() => setShowUncertainty(!showUncertainty)}
          style={{ marginRight: 10 }}
        />
        show uncertainty
      </span>
    </div>
  );
};
