import { EventCard } from "./EventCard";
import React, { useEffect, useState } from "react";
import { compareAsc } from "date-fns";
import { MagnitudeIcon } from "./icons/MagnitudeIcon";
import { ArrowUpIcon } from "./icons/ArrowUpIcon";
import { ArrowDownIcon } from "./icons/ArrowDownIcon";
import { ClockIcon } from "./icons/ClockIcon";

export const EventsList = ({ header: headerText, geoEvents, map }) => {
  const sortByTime = (arr, ascending) => {
    if (ascending) {
      return arr.sort(
        (a, b) => -compareAsc(new Date(a.time), new Date(b.time))
      );
    }
    return arr.sort((a, b) => compareAsc(new Date(a.time), new Date(b.time)));
  };

  const sortByMagn = (arr, ascending) => {
    if (ascending) {
      return arr.sort((a, b) => Number(b.magnitude) - Number(a.magnitude));
    }
    return arr.sort((a, b) => Number(a.magnitude) - Number(b.magnitude));
  };

  const [clockArrowUp, setClockArrowUp] = useState(false);
  const [magnArrowUp, setMagnArrowUp] = useState(false);
  const [gEvents, setGEvents] = useState(geoEvents);

  useEffect(() => {
    setGEvents(
      geoEvents.sort((a, b) => Number(b.magnitude) - Number(a.magnitude))
    );
  }, [geoEvents]);

  const onClickClockArrow = () => {
    setGEvents(sortByTime(gEvents, clockArrowUp));
    setClockArrowUp(!clockArrowUp);
  };

  const onClickMagnArrow = () => {
    setGEvents(sortByMagn(gEvents, magnArrowUp));
    setMagnArrowUp(!magnArrowUp);
  };

  return (
    <div className="event_card_container">
      <div className="event_card_container_header">
        {headerText}
        <div className="icons_wrapper">
          <div className="clock_icons">
            <ClockIcon />
            {clockArrowUp ? (
              <ArrowUpIcon onClick={onClickClockArrow} />
            ) : (
              <ArrowDownIcon onClick={onClickClockArrow} />
            )}
          </div>
          <div className="magn_icons">
            <MagnitudeIcon />
            {magnArrowUp ? (
              <ArrowUpIcon onClick={onClickMagnArrow} />
            ) : (
              <ArrowDownIcon onClick={onClickMagnArrow} />
            )}
          </div>
        </div>
      </div>
      <div className="event_card_wrapper_outer">
        <div className="event_card_wrapper_inner">
          {gEvents?.map((item) => (
            <EventCard geoEvent={item} map={map} key={item.time} />
          ))}
        </div>
      </div>
    </div>
  );
};
