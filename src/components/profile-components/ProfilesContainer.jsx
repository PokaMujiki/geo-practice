import { ProfilePlot } from "./ProfilePlot";
import { ProfileOptions } from "./ProfileOptions";
import "../../styles/profile.css";
import L from "leaflet";

export const ProfilesContainer = ({ profiles, setProfiles, geoEvents }) => {
  // const allProfilesEvents = []; // contains events for every profile

  // for (let i = 0; i < geoEvents.length; i++) {
  //   for (let j = 0; j < profiles.length; j++) {
  //     if (!profiles[j]?.bounds) {
  //       allProfilesEvents[j] = [];
  //       continue;
  //     }
  //
  //     if (
  //       profiles[j].bounds.contains(
  //         L.latLng(geoEvents[i].latitude, geoEvents[i].longitude)
  //       )
  //     ) {
  //       if (!allProfilesEvents[j]?.length) {
  //         allProfilesEvents[j] = [geoEvents[i]];
  //       } else {
  //         allProfilesEvents[j].push(geoEvents[i]);
  //       }
  //     }
  //   }
  // }

  console.log(profiles);

  return (
    <>
      {profiles?.map((item, index) => (
        <div className="profile_wrapper">
          <ProfileOptions
            profiles={profiles}
            setProfiles={setProfiles}
            geoEvents={geoEvents}
            profileIndex={index}
            key={index + 10000}
          />
          <ProfilePlot profileInfo={item} geoEvents={geoEvents} key={index} />
        </div>
      ))}
    </>
  );
};
