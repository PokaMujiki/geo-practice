import { EventCard } from "./EventCard";
import React, { useEffect, useState } from "react";
import { compareAsc } from "date-fns";
import { MagnitudeIcon } from "./icons/MagnitudeIcon";
import { ArrowUpIcon } from "./icons/ArrowUpIcon";
import { ArrowDownIcon } from "./icons/ArrowDownIcon";
import { ClockIcon } from "./icons/ClockIcon";
import { SelectedEventsIcon } from "./icons/SelectedEventsIcon";
import {
  DEFAULT_GEO_EVENT_FILL_COLOR,
  DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR,
} from "../lib/constants";
import { partition } from "../lib/helpers";

// TODO: fix initial sort
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
  const [firstShowSelected, setFirstShowSelected] = useState(false);

  const [gEvents, setGEvents] = useState(geoEvents);
  const [lastSortType, setLastSortType] = useState({
    type: "magn",
    asc: true,
  });

  useEffect(() => {
    setGEvents(
      geoEvents.sort((a, b) => Number(b.magnitude) - Number(a.magnitude))
    );
  }, [geoEvents]);

  const onClickSelectedEvents = () => {
    let firstSelected = !firstShowSelected;

    if (firstSelected) {
      // TODO: change logic
      let parts = partition(gEvents, (item) => item.selected);
      setGEvents([...parts.pass, ...parts.fail]);
    } else {
      if (lastSortType.type === "magn") {
        setGEvents(sortByMagn(gEvents, lastSortType.asc));
      } else {
        setGEvents(sortByTime(gEvents, lastSortType.asc));
      }
    }

    setFirstShowSelected(!firstShowSelected);
  };

  const onClickClockArrow = () => {
    if (firstShowSelected) {
      let parts = partition(gEvents, (item) => item.selected);
      setGEvents([
        ...sortByTime(parts.pass, clockArrowUp),
        ...sortByTime(parts.fail, clockArrowUp),
      ]);
    } else {
      setGEvents(sortByTime(gEvents, clockArrowUp));
    }

    setLastSortType({ type: "time", asc: clockArrowUp });
    setClockArrowUp(!clockArrowUp);
  };

  const onClickMagnArrow = () => {
    if (firstShowSelected) {
      let parts = partition(gEvents, (item) => item.selected);
      setGEvents([
        ...sortByMagn(parts.pass, magnArrowUp),
        ...sortByMagn(parts.fail, magnArrowUp),
      ]);
    } else {
      setGEvents(sortByMagn(gEvents, magnArrowUp));
    }

    setLastSortType({ type: "magn", asc: magnArrowUp });
    setMagnArrowUp(!magnArrowUp);
  };

  return (
    <div className="event_card_container content_card_dark">
      <div className="event_card_container_header">
        {headerText}
        <div className="icons_wrapper">
          <div className="selected_events_icon">
            <SelectedEventsIcon
              onClick={onClickSelectedEvents}
              circlesFill={
                firstShowSelected
                  ? DEFAULT_SELECTED_GEO_EVENT_FILL_COLOR
                  : DEFAULT_GEO_EVENT_FILL_COLOR
              }
            />
          </div>
          <div className="icons_container">
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
