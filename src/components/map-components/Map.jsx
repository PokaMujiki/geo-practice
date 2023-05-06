import {
  LayerGroup,
  MapContainer,
  Polygon,
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
import { getUnselectedEvents } from "../../lib/helpers";
import { Profile } from "./Profile";

export const Map = ({
  center,
  stations,
  geoEvents,
  selectedGeoEvents,
  setSelectedGeoEvents,
  setMap,
  profiles,
  setProfiles,
}) => {
  const geoEventsMemo = useMemo(() => {
    if (!geoEvents?.length) return;

    const unselectedEvents = getUnselectedEvents(geoEvents, selectedGeoEvents);

    return (
      <>
        {unselectedEvents?.map((item, index) => (
          <GeoEvent geoEvent={item} isSelected={false} key={index} />
        ))}
        {selectedGeoEvents?.map((item, index) => (
          <GeoEvent geoEvent={item} isSelected={true} key={index + 1000000} />
        ))}
      </>
    );
  }, [geoEvents, selectedGeoEvents]);

  const stationsMemo = useMemo(() => {
    if (stations?.length) return;

    return (
      <>
        {stations?.map((item, index) => (
          <Station station={item} key={index} />
        ))}
      </>
    );
  }, [stations]);

  return (
    <MapContainer
      center={[center.lng, center.lat]}
      zoom={center.zoom}
      preferCanvas={true}
      renderer={L.canvas()}
      whenReady={(e) => setMap(e.target)}
      scrollWheelZoom={false}
    >
      <ScaleControl imperial={false} />
      <MouseWheelEnableOnFocus />
      <LeafletRuler />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SelectMapArea
        geoEvents={geoEvents}
        setSelectedGeoEvents={setSelectedGeoEvents}
      />
      <LayersControl>
        <LayersControl.Overlay name="Stations" checked>
          <LayerGroup>{stationsMemo}</LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Events" checked>
          <LayerGroup>{geoEventsMemo}</LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
      <ProfileCreator setProfiles={setProfiles} />
      {profiles?.length &&
        profiles.map((item, index) => (
          <Profile profiles={profiles} profileIndex={index} key={index} />
        ))}
      {/*<Polygon*/}
      {/*  color="red"*/}
      {/*  positions={[*/}
      {/*    [51.355035827777435, 53.14594917479043],*/}
      {/*    [51.35610854585277, 53.17273912014637],*/}
      {/*    [51.338159194971, 53.174586655284074],*/}
      {/*    [51.33708647689564, 53.14779666668072],*/}
      {/*    [51.33708647689564, 53.14779666668072],*/}
      {/*  ]}*/}
      {/*/>*/}
    </MapContainer>
  );
};
