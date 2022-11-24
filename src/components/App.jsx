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
import {Theme, presetGpnDark} from '@consta/uikit/Theme';
import {DatePicker} from "@consta/uikit/DatePicker";
import {format} from "date-fns";
import {BValuePlot} from "./BValuePlot";
import {RepeatabilityPlot} from "./RepeatabilityPlot";
import {Slider} from "@consta/uikit/Slider";

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
  const [step, setStep] = useState(0.05);
  const [openedGeoEvent, setOpenedGeoEvent] = useState([]);

  useEffect(() => {
    const setInitialStations = async (network) => {
      // const query = BASENAME_API + "station/1/query?";
      // const response = await fetch(query);
      const response = await fetch(BASENAME_API + "station/1/stations.xml");
      const data = await response.text();

      setStations(parseStations(data));
    }
    setInitialStations("").catch(console.error);
  }, []);

  useEffect(() => {
    const setInitialEvents = async () => {
      // const formatString = "yyyy-MM-dd'T'kk:mm:ss";
      // const formattedStartTime = format(startTime, formatString);
      // const formattedEndTime = format(endTime, formatString);
      //
      //
      //
      // const query = BASENAME_API + "event/1/query?";
      // const params = new URLSearchParams({
      //   starttime: formattedStartTime,
      //   endtime: formattedEndTime,
      //   // includearrivals: true,
      //   // limit: eventsLimit,
      // });

      // const response = await fetch(query + params.toString());
      const response = await fetch(BASENAME_API + "event/1/jan_jul_events.xml");
      const data = await response.text();

      setGeoEvents(parseGeoEvents(data))
    }

    setInitialEvents().catch(console.error);
  }, [startTime, endTime, eventsLimit]);

  //TODO: добавить input field для eventsLimit
  //TODO: добавить checkbox для включения интерактивности pop-ups
  //TODO: добавить checkbox для показа станций
  //TODO: сделать скоролл для контейнера с карточками

  // TODO: добавить возможность выбора интервала для аппроксимации
  // TODO: https://www.usgs.gov/
  // TODO: https://earthquake.usgs.gov/earthquakes/map/?extent=3.16246,-146.16211&extent=65.40344,-5.53711
  // TODO: https://stationview.raspberryshake.org/#/?lat=43.72109&lon=22.95633&zoom=4.231
  // TODO: попытаться загрузить ивенты снова, связаться с человеком который это уже делал

  console.log("selected")
  console.log(selectedGeoEvents)

  return (
    <div className="App">
      <div className="event_card_wrapper">
        { geoEvents?.map((item, index) =>
          <EventCard geoEvent={item} setOpenedGeoEvent={setOpenedGeoEvent} key={index}/>) }
      </div>
      <div className="map_wrapper">
        <MapComponent
          center={center}
          stations={stations}
          geoEvents={geoEvents}
          openedGeoEvent={openedGeoEvent}
          setSelectedGeoEvents={setSelectedGeoEvents}/>

        <div className="map_related_wrapper">
          <Theme preset={presetGpnDark}>
            <div className="map_options_wrapper">
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
              <div className="sliders_wrapper">
                <Slider
                  label="step"
                  onChange={({value}) => setStep(value)}
                  value={step}
                  min={0.01}
                  max={0.1}
                  withTooltip
                  step={0.001}
                />
              </div>
            </div>
          </Theme>
          {selectedGeoEvents.length > 0 &&
            <div className="plots_wrapper">
              <BValuePlot geoEvents={selectedGeoEvents}
                          step={step}/>
              <RepeatabilityPlot geoEvents={selectedGeoEvents}/>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
