import { ProfilePlot } from "./ProfilePlot";
import { ProfileOptions } from "./ProfileOptions";
import "../../styles/profile.css";

export const ProfilesContainer = ({ profiles, setProfiles, geoEvents }) => {
  if (!geoEvents[0]?.depthUncertainty) {
    return null;
  }
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
