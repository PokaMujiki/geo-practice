import {
  LayerGroup,
  MapContainer,
  ScaleControl,
  TileLayer,
} from "react-leaflet";
import React, { useMemo } from "react";
import { Station } from "./Station";
import { GeoEvent } from "./GeoEvent";
import LeafletRuler from "./leaflet-ruler/code/LeafletRuler";
import { SelectMapArea } from "./SelectMapArea";
import { LayersControl } from "react-leaflet";
import L from "leaflet";
import { ProfileCreator } from "./ProfileCreator";
import { MouseWheelEnableOnFocus } from "./MouseWheel";

export const MapComponent = ({
  center,
  stations,
  geoEvents,
  setSelectedGeoEvents,
  setMap,
  setGeoEvents,
  profiles,
  setProfiles,
}) => {
  // const geoEventsComponent = useMemo(() => {
  //   return geoEvents?.map((item, index) =>
  //     <GeoEvent geoEvent={item} key={index}/>);
  // }, [geoEvents]);

  // TODO: починить линейку
  return (
    <MapContainer
      center={[center.lng, center.lat]}
      zoom={center.zoom}
      preferCanvas={true}
      renderer={L.canvas()}
      whenReady={(e) => setMap(e.target)}
    >
      <ScaleControl imperial={false} />
      <MouseWheelEnableOnFocus />
      {/*<LeafletRuler />*/}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SelectMapArea
        geoEvents={geoEvents}
        setSelectedGeoEvents={setSelectedGeoEvents}
        setGeoEvents={setGeoEvents}
      />
      <LayersControl>
        <LayersControl.Overlay name="Stations" checked>
          <LayerGroup>
            {stations?.map((item, index) => (
              <Station station={item} key={index} />
            ))}
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Events" checked>
          <LayerGroup>
            {geoEvents?.map((item, index) => (
              <GeoEvent geoEvent={item} key={index} />
            ))}

            {/*<Events geoEvents={geoEvents}/>*/}
            {/*{ geoEvents?.map((item, index) => <GeoEvent geoEvent={item} openedGeoEvent={openedGeoEvent} key={index}/>) }*/}
            {/*{geoEventsComponent}*/}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
      <ProfileCreator profiles={profiles} setProfiles={setProfiles} />
    </MapContainer>
  );
};
