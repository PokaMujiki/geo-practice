import React, {useEffect, useState} from 'react';
import '../styles/App.css';
import '../styles/Map.css';
import '../styles/event_card.css';
import '../styles/date_time_picker.css';
import '../styles/b_value_plot_wrapper.css';
import {EventCard} from "./EventCard";
import {MapComponent} from "./map_components/MapComponent";
import {parseGeoEvents, parseStations} from "../lib/parsers";
import {BASENAME_API} from "../lib/constants";
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import {DatePicker} from "@consta/uikit/DatePicker";
import {format} from "date-fns";
import {BValuePlot} from "./BValuePlot";

export const App = () => {
  const [center, setCenter] = useState({
    lat: 51.2881,
    lng: 53.3528,
    zoom: 7
  });

  const [startTime, setStartTime] = useState(new Date('2021-10-01T00:00:00'));
  const [endTime, setEndTime] = useState(new Date('2021-10-31T23:59:59'));
  const [eventsLimit, setEventsLimit] = useState(10);
  const [geoEvents, setGeoEvents] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedGeoEvents, setSelectedGeoEvents] = useState([]);

  useEffect(() => {
    const setInitialStations = async (network) => {
      const query = BASENAME_API + "station/1/query?";
      const response = await fetch(query);
      const data = await response.text();

      setStations(parseStations(data));
    }
    setInitialStations("").catch(console.error);
  }, []);

  useEffect(() => {
    const setInitialEvents = async () => {
      const formatString = "yyyy-MM-dd'T'kk:mm:ss";
      const formattedStartTime = format(startTime, formatString);
      const formattedEndTime = format(endTime, formatString);

      // TODO: includearrivals включать или не вклбчать в запрос?

      const query = BASENAME_API + "event/1/query?";
      const params = new URLSearchParams({
        starttime: formattedStartTime,
        endTime: formattedEndTime,
        includearrivals: true,
        limit: eventsLimit,
      })

      const response = await fetch(query + params.toString());
      const data = await response.text();

      setGeoEvents(parseGeoEvents(data))
    }

    setInitialEvents().catch(console.error);
  }, [startTime, endTime, eventsLimit]);

  //TODO: добавить input field для eventsLimit
  //TODO: добавить checkbox для включения интерактивности pop-ups
  //TODO: добавить checkbox для показа станций
  //TODO: сделать скоролл для контейнера с карточками

  return (
    <div className="App">
      <div className="event_card_wrapper">
        { geoEvents?.map((item, index) => <EventCard geoEvent={item} key={index}/>) }
      </div>
      <div className="map_wrapper">
        <MapComponent
          center={center}
          stations={stations}
          geoEvents={geoEvents}
          setSelectedGeoEvents={setSelectedGeoEvents}/>

        <div className="map_options_wrapper">
          <Theme preset={presetGpnDefault}>
            <DatePicker
              className="date_time_picker"
              type="date-time-range"
              value={[startTime, endTime]}
              style={{zIndex: 3}}
              format="dd.MM.yyyy HH:mm:ss"
              onChange={({value: [newStartTime, newEndTime]}) => {
                setStartTime(newStartTime);
                setEndTime(newEndTime);
            }} />
          </Theme>
          {selectedGeoEvents &&
            <div className="b_value_plot_wrapper">
              <BValuePlot geoEvents={selectedGeoEvents}/>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
