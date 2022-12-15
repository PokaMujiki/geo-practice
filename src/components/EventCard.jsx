import { format } from "date-fns";
import { PointerIcon } from "./icons/PointerIcon";
import { FLYTO_ANIMATION_DURATION } from "../lib/constants";

export const EventCard = ({ geoEvent, map }) => {
  const date = format(new Date(geoEvent.time), "yyyy MMM do");
  const time = format(new Date(geoEvent.time), "HH:mm:ss");
  let border;

  if (geoEvent?.selected) {
    border = { border: "1px solid #0593ff" };
  }

  if (geoEvent?.excluded) {
    border = { border: "1px solid #ffc53a" };
  }

  return (
    <div className="event_card" style={border}>
      <p>
        {date} {time}
      </p>
      <p>
        <span>
          <PointerIcon
            onClick={() =>
              map.flyTo(
                [geoEvent.latitude, geoEvent.longitude],
                map.getZoom() > 14 ? map.getZoom() : 14,
                {
                  duration: FLYTO_ANIMATION_DURATION,
                  animate: true,
                }
              )
            }
          />
        </span>
        {geoEvent.type[0].toUpperCase()} magn: {geoEvent.magnitude} (
        {geoEvent.magnitudeType})
      </p>
    </div>
  );
};
