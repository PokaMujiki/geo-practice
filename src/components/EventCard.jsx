import {format} from "date-fns";

export const EventCard = ({geoEvent}) => {
  const date = format(new Date(geoEvent.time), "yyyy MMMM do");
  const time = format(new Date(geoEvent.time), "HH:mm:ss");
  return (
    <div className="event_card">
      <p>{date}   {time}</p>
      <p>Type: {geoEvent.type}</p>
      <p>Magnitude: {geoEvent.magnitude}({geoEvent.magnitudeType})</p>
      <p>Lng: {geoEvent.longitude} Lat: {geoEvent.latitude}</p>
      <p>Network code: {geoEvent.networkCode}</p>
      <p>Depth: {geoEvent.depth}({geoEvent.depthType}, uncertainty: {geoEvent.depthUncertainty})</p>
    </div>
  )
}