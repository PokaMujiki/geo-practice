import {LayerGroup, MapContainer, ScaleControl, TileLayer} from "react-leaflet";
import React, {useMemo} from "react";
import {Station} from "./Station";
import {GeoEvent} from "./GeoEvent";
import LeafletRuler from "./leaflet-ruler/code/LeafletRuler";
import {SelectMapArea} from "./SelectMapArea";
import {LayersControl} from "react-leaflet";
import {Events} from "./Events";
import L from "leaflet";

export const MapComponent = ({center, stations, geoEvents, openedGeoEvent, setSelectedGeoEvents}) => {
  const geoEventsComponent = useMemo(() => {
    console.log("recomputing...");
    return geoEvents?.map((item, index) =>
      <GeoEvent geoEvent={item} key={index}/>);
  }, [geoEvents]);

  // TODO: починить линейку
  return (
    <MapContainer center={[center.lng, center.lat]} zoom={center.zoom} preferCanvas={true} renderer={L.canvas()} >
      <ScaleControl imperial={false}/>
      {/*<LeafletRuler/>*/}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SelectMapArea geoEvents={geoEvents} setSelectedGeoEvents={setSelectedGeoEvents}/>
      <LayersControl>
        <LayersControl.Overlay name="Stations" checked>
          <LayerGroup>
            { stations?.map((item, index) => <Station station={item} key={index}/>) }
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Events" checked>
          <LayerGroup>
            {/*<Events geoEvents={geoEvents}/>*/}
            {/*{ geoEvents?.map((item, index) => <GeoEvent geoEvent={item} openedGeoEvent={openedGeoEvent} key={index}/>) }*/}
            {geoEventsComponent}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  )
}