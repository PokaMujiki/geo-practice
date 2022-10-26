import {MapContainer, ScaleControl, TileLayer} from "react-leaflet";
import React from "react";
import {Station} from "./Station";
import {GeoEvent} from "./GeoEvent";
import LeafletRuler from "./leaflet-ruler/code/LeafletRuler";
import {SelectMapArea} from "./SelectMapArea";

export const MapComponent = ({center, stations, geoEvents, openedGeoEvent, setSelectedGeoEvents}) => {
  // TODO: починить линейку
  return (
    <MapContainer center={[center.lng, center.lat]} zoom={center.zoom}>
      <ScaleControl imperial={false}/>
      {/*<LeafletRuler/>*/}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SelectMapArea geoEvents={geoEvents} setSelectedGeoEvents={setSelectedGeoEvents}/>
      { stations?.map((item, index) => <Station station={item} key={index}/>) }
      { geoEvents?.map((item, index) => <GeoEvent geoEvent={item} openedGeoEvent={openedGeoEvent} key={index}/>) }
    </MapContainer>
  )
}