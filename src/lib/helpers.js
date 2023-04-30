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
