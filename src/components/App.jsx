import React, { useEffect, useState } from "react";
import "../styles/App.css";
import "../styles/Map.css";
import "../styles/event_card.css";
import { Map } from "./map-components/Map";
import { parseGeoEvents, parseStations } from "../lib/parsers";
import { BASENAME_API } from "../lib/constants";
import { Theme, presetGpnDark } from "@consta/uikit/Theme";
import { DatePicker } from "@consta/uikit/DatePicker";
import { BValuePlot } from "./BValuePlot";
import { RepeatabilityPlot } from "./RepeatabilityPlot";
import { EventsList } from "./EventsList";
import { enUS } from "date-fns/locale";
import { TextFieldLeftCaption } from "./TextFieldLeftCaption";
import { ProfilesContainer } from "./profile-components/ProfilesContainer";
import { stationsExample } from "./server-responses-mocks/StationsServerResponseExample";
import { eventsExample } from "./server-responses-mocks/EventsServerResponseExample";

export const App = () => {
  const initialCenter = {
    lat: 51.306,
    lng: 53.2706,
    zoom: 12,
  };

  const [startTime, setStartTime] = useState(new Date("2021-10-01T00:00:00"));
  const [endTime, setEndTime] = useState(new Date("2021-10-31T23:59:59"));
  const [eventsLimit, setEventsLimit] = useState(1000);
  const [geoEvents, setGeoEvents] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedGeoEvents, setSelectedGeoEvents] = useState([]);
  const [map, setMap] = useState();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const setInitialStations = async () => {
      // const response = await fetch(BASENAME_API + "station/1/stations.xml");
      // const data = await response.text();
      const data = stationsExample;

      setStations(parseStations(data));
    };
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
      const response = await fetch(
        BASENAME_API +
          "event/1/random_uncertainty.xml" /*"http://84.237.89.72:8080/fdsnws/event/1/query"*/
      );
      const data = await response.text();
      // const data = eventsExample;

      setGeoEvents(parseGeoEvents(data));
      setSelectedGeoEvents([]);
    };

    setInitialEvents().catch(console.error);
  }, [startTime, endTime, eventsLimit]);

  // TODO: https://www.usgs.gov/
  // TODO: https://earthquake.usgs.gov/earthquakes/map/?extent=3.16246,-146.16211&extent=65.40344,-5.53711
  // TODO: https://stationview.raspberryshake.org/#/?lat=43.72109&lon=22.95633&zoom=4.231

  return (
    <div className="App">
      <EventsList header="Events catalog" geoEvents={geoEvents} map={map} />
      <div className="map_content">
        <div className="map_container">
          <Map
            center={initialCenter}
            stations={stations}
            geoEvents={geoEvents}
            selectedGeoEvents={selectedGeoEvents}
            setSelectedGeoEvents={setSelectedGeoEvents}
            map={map}
            setMap={setMap}
            profiles={profiles}
            setProfiles={setProfiles}
          />
          <div className="options_container">
            <Theme preset={presetGpnDark}>
              <div className="options_wrapper">
                <TextFieldLeftCaption
                  type="number"
                  value={eventsLimit}
                  setValue={setEventsLimit}
                  caption="Max events: "
                />
                <DatePicker
                  type="date-time-range"
                  value={[startTime, endTime]}
                  style={{ zIndex: 3 }}
                  locale={enUS}
                  format="dd.MM.yyyy HH:mm:ss"
                  onChange={({ value: [newStartTime, newEndTime] }) => {
                    setStartTime(newStartTime);
                    setEndTime(newEndTime);
                  }}
                />
              </div>
            </Theme>
          </div>
        </div>
        <ProfilesContainer
          profiles={profiles}
          setProfiles={setProfiles}
          geoEvents={geoEvents}
        />
        {selectedGeoEvents.length > 0 && (
          <BValuePlot seismicEvents={selectedGeoEvents} />
        )}
        <RepeatabilityPlot
          geoEvents={geoEvents}
          selectedGeoEvents={selectedGeoEvents}
        />
      </div>
    </div>
  );
};

export default App;
