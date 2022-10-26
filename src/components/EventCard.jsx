import {format} from "date-fns";

export const EventCard = ({geoEvent, setOpenedGeoEvent}) => {
  const date = format(new Date(geoEvent.time), "yyyy MMMM do");
  const time = format(new Date(geoEvent.time), "HH:mm:ss");
  return (
    <div className="event_card">
      <p>{date} {time}</p>
      <p>
        {geoEvent.type[0].toUpperCase() +
          geoEvent.type.substring(1)} magnitude: {geoEvent.magnitude} {geoEvent.magnitudeType}
      </p>
      <label onClick={() => console.log(geoEvent)}>Show on map</label>
    </div>
  )
}