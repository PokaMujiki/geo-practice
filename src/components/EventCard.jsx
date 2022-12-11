import {format} from "date-fns";

export const EventCard = ({geoEvent, map}) => {
  const date = format(new Date(geoEvent.time), "yyyy MMM do");
  const time = format(new Date(geoEvent.time), "HH:mm:ss");
  return (
    <div className="event_card">
      <p>{date} {time}</p>
      <p>
        {geoEvent.type[0].toUpperCase()} magn: {geoEvent.magnitude} ({geoEvent.magnitudeType})
      </p>
      <p onClick={() => map.flyTo([geoEvent.latitude, geoEvent.longitude], map.getZoom() > 14 ? map.getZoom() : 14)}>Show on map</p>
    </div>
  )
}