import SelectArea from 'leaflet-area-select';
import {useMap} from "react-leaflet";

export const SelectMapArea = ({geoEvents, setSelectedGeoEvents, setGeoEvents}) => {
  let map = useMap();
  map.selectArea.enable();
  map.on('areaselected', (e) => {
    let totalSelected = 0;

    // eslint-disable-next-line array-callback-return
    geoEvents.map(geoEvent => {
      // console.log("event data: ");
      // console.log(geoEvent.latitude);
      // console.log(geoEvent.longitude);
      //
      // console.log("state: ")
      // console.log(geoEvent.latitude <= e.bounds._northEast.lat)
      // console.log(geoEvent.latitude >= e.bounds._southWest.lat)
      // console.log(geoEvent.longitude <= e.bounds._northEast.lng)
      // console.log(geoEvent.longitude >= e.bounds._southWest.lng)

      if (geoEvent.latitude <= e.bounds._northEast.lat && geoEvent.latitude >= e.bounds._southWest.lat
        && geoEvent.longitude <= e.bounds._northEast.lng && geoEvent.longitude >= e.bounds._southWest.lng) {
        geoEvent.selected = true;
        // console.log("selected lng: " + geoEvent.longitude + " lat: " + geoEvent.latitude);
        totalSelected++;
      }
      else {
        geoEvent.selected = false;
      }
    })

    setGeoEvents(geoEvents);

    // console.log("total selected: " + totalSelected);
    setSelectedGeoEvents(geoEvents.filter(item => item.selected));
  });

  return null;
}