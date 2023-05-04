import { bearing, destination, point } from "@turf/turf";
import { LatLng } from "leaflet";

export const getParallelLineLatLng = (
  startLatLng,
  endLatLng,
  distanceKm,
  sign
) => {
  const start = point([startLatLng.lng, startLatLng.lat]);
  const end = point([endLatLng.lng, endLatLng.lat]);
  const bearingAngle = bearing(start, end);

  const parallelStart = destination(
    start,
    distanceKm,
    bearingAngle + sign * 90
  );
  const parallelEnd = destination(end, distanceKm, bearingAngle + sign * 90);

  const parallelStartLatLng = new LatLng(
    parallelStart.geometry.coordinates[1],
    parallelStart.geometry.coordinates[0]
  );
  const parallelEndLatLng = new LatLng(
    parallelEnd.geometry.coordinates[1],
    parallelEnd.geometry.coordinates[0]
  );

  return [parallelStartLatLng, parallelEndLatLng];
};

export const getParallelPolygon = (startLatLng, endLatLng, widthKm) => {
  const second = getParallelLineLatLng(startLatLng, endLatLng, widthKm / 2, 1);
  const tmp = second[0];
  second[0] = second[1];
  second[1] = tmp;
  return [
    ...getParallelLineLatLng(startLatLng, endLatLng, widthKm / 2, -1),
    ...second,
  ];
};
