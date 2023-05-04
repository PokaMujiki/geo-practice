import { format } from "date-fns";

export const partition = (arr, filterFunc) => {
  const pass = [];
  const fail = [];

  arr.forEach((item) => (filterFunc(item) ? pass.push(item) : fail.push(item)));

  return { pass, fail };
};

export const getUnselectedEvents = (events, selectedEvents) => {
  const unselected = [];
  let isSelected = false;

  for (let i = 0; i < events.length; i++) {
    for (let j = 0; j < selectedEvents.length; j++) {
      if (events[i].id === selectedEvents[j].id) {
        isSelected = true;
        break;
      }
    }

    if (!isSelected) {
      unselected.push(events[i]);
    }
    isSelected = false;
  }

  return unselected;
};

export const toNormalDate = (date) => {
  return format(new Date(date), "yyyy MMM do");
  const time = format(new Date(geoEvent.time), "HH:mm:ss");
};

export const toNormalTime = (date) => {
  return format(new Date(date), "HH:mm:ss");
};
