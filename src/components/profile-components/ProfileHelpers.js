import L from "leaflet";
import { getParallelPolygon } from "../../lib/parallel";
import { point } from "turf";

// counts how many points are in the polygon which is parallel to given in profile line and has width given from profile
// returns array of geoevents
export const pointsInParallelPolygon = (profile, geoEvents) => {
  const width = profile.width;

  const radiusBounds = L.polygon(
    getParallelPolygon(profile.positions[0], profile.positions[1], width)
  ).getBounds();

  let events = [];
  for (let i = 0; i < geoEvents.length; i++) {
    const eventLatLng = L.latLng(geoEvents[i].latitude, geoEvents[i].longitude);
    if (radiusBounds.contains(eventLatLng)) {
      events.push(geoEvents[i]);
    }
  }

  return events;
};

export const myPoint2TurfPoint = (myPoint) => {
  return point([Number(myPoint.longitude), Number(myPoint.latitude)]);
};

export const LatLng2TurfPoint = (LatLng) => {
  return point([LatLng.lng, LatLng.lat]);
};

// transforms polygon positions to turfjs format
export const leafletPolygonPos2TurfPolygonPos = (polygonPositions) => {
  if (!polygonPositions?.length) {
    return [];
  }

  const updatedPositions = [];

  polygonPositions.map((item) => {
    updatedPositions.push([item.lng, item.lat]);
  });

  updatedPositions.push(updatedPositions[0]);

  return updatedPositions;
};
