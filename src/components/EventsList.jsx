import {EventCard} from "./EventCard";
import React from "react";

export const EventsList = ({geoEvents, map}) => {
  return (
    <div className="event_card_container">
      <p>Events</p>
      <div className="event_card_wrapper_outer">
        <div className="event_card_wrapper_inner">
          { geoEvents?.map((item, index) =>
            <EventCard geoEvent={item} map={map} key={index}/>) }
        </div>
      </div>
    </div>
  );
}