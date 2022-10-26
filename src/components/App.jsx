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
  // const [a_value, setA_value] = useState(1);
  const [b_value, setB_value] = useState(1);
  const [openedGeoEvent, setOpenedGeoEvent] = useState([]);

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

      // const response = await fetch(query + params.toString());
      // const data = await response.text();
      const data = "<q:quakeml xmlns=\"http://quakeml.org/xmlns/bed/1.2\" xmlns:q=\"http://quakeml.org/xmlns/quakeml/1.2\">\n" +
        "    <eventParameters publicID=\"smi:org.gfz-potsdam.de/geofon/EventParameters\">\n" +
        "        <event publicID=\"smi:ippg_nsk.ippg.org/event/ipggsbrasippg2021svnj\">\n" +
        "            <typeCertainty>known</typeCertainty>\n" +
        "            <creationInfo>\n" +
        "                <agencyID>IPGGSBRAS</agencyID>\n" +
        "                <creationTime>2022-03-29T16:10:14.0000Z</creationTime>\n" +
        "            </creationInfo>\n" +
        "            <magnitude publicID=\"smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021svnj/ml\">\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>ipggsbras</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:14.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <mag>\n" +
        "                    <value>3.4</value>\n" +
        "                </mag>\n" +
        "                <type>ml</type>\n" +
        "                <originID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021svnj</originID>\n" +
        "            </magnitude>\n" +
        "            <origin publicID=\"smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021svnj\">\n" +
        "                <time>\n" +
        "                    <value>2021-10-27T03:52:50.1358Z</value>\n" +
        "                    <uncertainty>0.026182</uncertainty>\n" +
        "                </time>\n" +
        "                <longitude>\n" +
        "                    <value>53.3437</value>\n" +
        "                </longitude>\n" +
        "                <latitude>\n" +
        "                    <value>51.3402</value>\n" +
        "                </latitude>\n" +
        "                <depthType>from location</depthType>\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>IPGGSBRAS</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:14.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <depth>\n" +
        "                    <value>4562</value>\n" +
        "                    <uncertainty>410.465</uncertainty>\n" +
        "                </depth>\n" +
        "            </origin>\n" +
        "            <preferredOriginID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021svnj</preferredOriginID>\n" +
        "            <preferredMagnitudeID>smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021svnj/ml</preferredMagnitudeID>\n" +
        "            <type>earthquake</type>\n" +
        "        </event>\n" +
        "\n" +
        "        <event publicID=\"smi:ippg_nsk.ippg.org/event/ipggsbrasippg2021iorn\">\n" +
        "            <typeCertainty>known</typeCertainty>\n" +
        "            <creationInfo>\n" +
        "                <agencyID>IPGGSBRAS</agencyID>\n" +
        "                <creationTime>2022-03-29T16:10:13.0000Z</creationTime>\n" +
        "            </creationInfo>\n" +
        "            <magnitude publicID=\"smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021iorn/ml\">\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>ipggsbras</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:13.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <mag>\n" +
        "                    <value>1.3</value>\n" +
        "                </mag>\n" +
        "                <type>ml</type>\n" +
        "                <originID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021iorn</originID>\n" +
        "            </magnitude>\n" +
        "            <origin publicID=\"smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021iorn\">\n" +
        "                <time>\n" +
        "                    <value>2021-10-26T19:45:03.056Z</value>\n" +
        "                    <uncertainty>0.122826</uncertainty>\n" +
        "                </time>\n" +
        "                <longitude>\n" +
        "                    <value>53.2169</value>\n" +
        "                </longitude>\n" +
        "                <latitude>\n" +
        "                    <value>51.3369</value>\n" +
        "                </latitude>\n" +
        "                <depthType>from location</depthType>\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>IPGGSBRAS</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:13.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <depth>\n" +
        "                    <value>3981</value>\n" +
        "                    <uncertainty>1040.36</uncertainty>\n" +
        "                </depth>\n" +
        "            </origin>\n" +
        "            <preferredOriginID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021iorn</preferredOriginID>\n" +
        "            <preferredMagnitudeID>smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021iorn/ml</preferredMagnitudeID>\n" +
        "            <type>earthquake</type>\n" +
        "        </event>\n" +
        "        <event publicID=\"smi:ippg_nsk.ippg.org/event/ipggsbrasippg2021wyqs\">\n" +
        "            <typeCertainty>known</typeCertainty>\n" +
        "            <creationInfo>\n" +
        "                <agencyID>IPGGSBRAS</agencyID>\n" +
        "                <creationTime>2022-03-29T16:10:13.0000Z</creationTime>\n" +
        "            </creationInfo>\n" +
        "            <magnitude publicID=\"smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021wyqs/ml\">\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>ipggsbras</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:13.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <mag>\n" +
        "                    <value>0.8</value>\n" +
        "                </mag>\n" +
        "                <type>ml</type>\n" +
        "                <originID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021wyqs</originID>\n" +
        "            </magnitude>\n" +
        "            <origin publicID=\"smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021wyqs\">\n" +
        "                <time>\n" +
        "                    <value>2021-10-10T13:25:51.5405Z</value>\n" +
        "                    <uncertainty>0.0607366</uncertainty>\n" +
        "                </time>\n" +
        "                <longitude>\n" +
        "                    <value>53.3448</value>\n" +
        "                </longitude>\n" +
        "                <latitude>\n" +
        "                    <value>51.3397</value>\n" +
        "                </latitude>\n" +
        "                <depthType>from location</depthType>\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>IPGGSBRAS</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:13.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <depth>\n" +
        "                    <value>4333</value>\n" +
        "                    <uncertainty>329.386</uncertainty>\n" +
        "                </depth>\n" +
        "            </origin>\n" +
        "            <preferredOriginID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021wyqs</preferredOriginID>\n" +
        "            <preferredMagnitudeID>smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021wyqs/ml</preferredMagnitudeID>\n" +
        "            <type>earthquake</type>\n" +
        "        </event>\n" +
        "        <event publicID=\"smi:ippg_nsk.ippg.org/event/ipggsbrasippg2021mbfu\">\n" +
        "            <typeCertainty>known</typeCertainty>\n" +
        "            <creationInfo>\n" +
        "                <agencyID>IPGGSBRAS</agencyID>\n" +
        "                <creationTime>2022-03-29T16:10:13.0000Z</creationTime>\n" +
        "            </creationInfo>\n" +
        "            <magnitude publicID=\"smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021mbfu/ml\">\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>ipggsbras</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:13.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <mag>\n" +
        "                    <value>1.7</value>\n" +
        "                </mag>\n" +
        "                <type>ml</type>\n" +
        "                <originID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021mbfu</originID>\n" +
        "            </magnitude>\n" +
        "            <origin publicID=\"smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021mbfu\">\n" +
        "                <time>\n" +
        "                    <value>2021-10-10T04:31:57.2122Z</value>\n" +
        "                    <uncertainty>0.051658</uncertainty>\n" +
        "                </time>\n" +
        "                <longitude>\n" +
        "                    <value>53.3479</value>\n" +
        "                </longitude>\n" +
        "                <latitude>\n" +
        "                    <value>51.3386</value>\n" +
        "                </latitude>\n" +
        "                <depthType>from location</depthType>\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>IPGGSBRAS</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:13.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <depth>\n" +
        "                    <value>4060</value>\n" +
        "                    <uncertainty>908.02</uncertainty>\n" +
        "                </depth>\n" +
        "            </origin>\n" +
        "            <preferredOriginID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021mbfu</preferredOriginID>\n" +
        "            <preferredMagnitudeID>smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021mbfu/ml</preferredMagnitudeID>\n" +
        "            <type>earthquake</type>\n" +
        "        </event>\n" +
        "        <event publicID=\"smi:ippg_nsk.ippg.org/event/ipggsbrasippg2021xuyp\">\n" +
        "            <typeCertainty>known</typeCertainty>\n" +
        "            <creationInfo>\n" +
        "                <agencyID>IPGGSBRAS</agencyID>\n" +
        "                <creationTime>2022-03-29T16:10:13.0000Z</creationTime>\n" +
        "            </creationInfo>\n" +
        "            <magnitude publicID=\"smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021xuyp/ml\">\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>ipggsbras</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:13.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <mag>\n" +
        "                    <value>2.5</value>\n" +
        "                </mag>\n" +
        "                <type>ml</type>\n" +
        "                <originID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021xuyp</originID>\n" +
        "            </magnitude>\n" +
        "            <origin publicID=\"smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021xuyp\">\n" +
        "                <time>\n" +
        "                    <value>2021-10-08T18:00:29.4148Z</value>\n" +
        "                    <uncertainty>0.0226344</uncertainty>\n" +
        "                </time>\n" +
        "                <longitude>\n" +
        "                    <value>53.3359</value>\n" +
        "                </longitude>\n" +
        "                <latitude>\n" +
        "                    <value>51.343</value>\n" +
        "                </latitude>\n" +
        "                <depthType>from location</depthType>\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>IPGGSBRAS</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:13.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <depth>\n" +
        "                    <value>4763</value>\n" +
        "                    <uncertainty>303.841</uncertainty>\n" +
        "                </depth>\n" +
        "            </origin>\n" +
        "            <preferredOriginID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021xuyp</preferredOriginID>\n" +
        "            <preferredMagnitudeID>smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021xuyp/ml</preferredMagnitudeID>\n" +
        "            <type>earthquake</type>\n" +
        "        </event>\n" +
        "        <event publicID=\"smi:ippg_nsk.ippg.org/event/ipggsbrasippg2021kwtt\">\n" +
        "            <typeCertainty>known</typeCertainty>\n" +
        "            <creationInfo>\n" +
        "                <agencyID>IPGGSBRAS</agencyID>\n" +
        "                <creationTime>2022-03-29T16:10:12.0000Z</creationTime>\n" +
        "            </creationInfo>\n" +
        "            <magnitude publicID=\"smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021kwtt/ml\">\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>ipggsbras</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:12.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <mag>\n" +
        "                    <value>1.6</value>\n" +
        "                </mag>\n" +
        "                <type>ml</type>\n" +
        "                <originID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021kwtt</originID>\n" +
        "            </magnitude>\n" +
        "            <origin publicID=\"smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021kwtt\">\n" +
        "                <time>\n" +
        "                    <value>2021-10-08T14:56:34.0628Z</value>\n" +
        "                    <uncertainty>0.171626</uncertainty>\n" +
        "                </time>\n" +
        "                <longitude>\n" +
        "                    <value>53.3192</value>\n" +
        "                </longitude>\n" +
        "                <latitude>\n" +
        "                    <value>51.3347</value>\n" +
        "                </latitude>\n" +
        "                <depthType>from location</depthType>\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>IPGGSBRAS</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:12.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <depth>\n" +
        "                    <value>4571</value>\n" +
        "                    <uncertainty>459.559</uncertainty>\n" +
        "                </depth>\n" +
        "            </origin>\n" +
        "            <preferredOriginID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021kwtt</preferredOriginID>\n" +
        "            <preferredMagnitudeID>smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021kwtt/ml</preferredMagnitudeID>\n" +
        "            <type>earthquake</type>\n" +
        "        </event>\n" +
        "        <event publicID=\"smi:ippg_nsk.ippg.org/event/ipggsbrasippg2021tjij\">\n" +
        "            <typeCertainty>known</typeCertainty>\n" +
        "            <creationInfo>\n" +
        "                <agencyID>IPGGSBRAS</agencyID>\n" +
        "                <creationTime>2022-03-29T16:10:12.0000Z</creationTime>\n" +
        "            </creationInfo>\n" +
        "            <magnitude publicID=\"smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021tjij/ml\">\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>ipggsbras</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:12.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <mag>\n" +
        "                    <value>2.4</value>\n" +
        "                </mag>\n" +
        "                <type>ml</type>\n" +
        "                <originID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021tjij</originID>\n" +
        "            </magnitude>\n" +
        "            <origin publicID=\"smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021tjij\">\n" +
        "                <time>\n" +
        "                    <value>2021-10-05T21:00:46.1953Z</value>\n" +
        "                    <uncertainty>0.0322658</uncertainty>\n" +
        "                </time>\n" +
        "                <longitude>\n" +
        "                    <value>53.3279</value>\n" +
        "                </longitude>\n" +
        "                <latitude>\n" +
        "                    <value>51.3347</value>\n" +
        "                </latitude>\n" +
        "                <depthType>from location</depthType>\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>IPGGSBRAS</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:12.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <depth>\n" +
        "                    <value>4471</value>\n" +
        "                    <uncertainty>386.326</uncertainty>\n" +
        "                </depth>\n" +
        "            </origin>\n" +
        "            <preferredOriginID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021tjij</preferredOriginID>\n" +
        "            <preferredMagnitudeID>smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021tjij/ml</preferredMagnitudeID>\n" +
        "            <type>earthquake</type>\n" +
        "        </event>\n" +
        "        <event publicID=\"smi:ippg_nsk.ippg.org/event/ipggsbrasippg2021zozg\">\n" +
        "            <typeCertainty>known</typeCertainty>\n" +
        "            <creationInfo>\n" +
        "                <agencyID>IPGGSBRAS</agencyID>\n" +
        "                <creationTime>2022-03-29T16:10:12.0000Z</creationTime>\n" +
        "            </creationInfo>\n" +
        "            <magnitude publicID=\"smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021zozg/ml\">\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>ipggsbras</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:12.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <mag>\n" +
        "                    <value>2.1</value>\n" +
        "                </mag>\n" +
        "                <type>ml</type>\n" +
        "                <originID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021zozg</originID>\n" +
        "            </magnitude>\n" +
        "            <origin publicID=\"smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021zozg\">\n" +
        "                <time>\n" +
        "                    <value>2021-10-04T06:13:27.1285Z</value>\n" +
        "                    <uncertainty>0.0725515</uncertainty>\n" +
        "                </time>\n" +
        "                <longitude>\n" +
        "                    <value>53.3416</value>\n" +
        "                </longitude>\n" +
        "                <latitude>\n" +
        "                    <value>51.336</value>\n" +
        "                </latitude>\n" +
        "                <depthType>from location</depthType>\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>IPGGSBRAS</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:12.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <depth>\n" +
        "                    <value>4038</value>\n" +
        "                    <uncertainty>563.709</uncertainty>\n" +
        "                </depth>\n" +
        "            </origin>\n" +
        "            <preferredOriginID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021zozg</preferredOriginID>\n" +
        "            <preferredMagnitudeID>smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021zozg/ml</preferredMagnitudeID>\n" +
        "            <type>earthquake</type>\n" +
        "        </event>\n" +
        "        <event publicID=\"smi:ippg_nsk.ippg.org/event/ipggsbrasippg2021ebwh\">\n" +
        "            <typeCertainty>known</typeCertainty>\n" +
        "            <creationInfo>\n" +
        "                <agencyID>IPGGSBRAS</agencyID>\n" +
        "                <creationTime>2022-03-29T16:10:12.0000Z</creationTime>\n" +
        "            </creationInfo>\n" +
        "            <magnitude publicID=\"smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021ebwh/ml\">\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>ipggsbras</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:12.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <mag>\n" +
        "                    <value>0.6</value>\n" +
        "                </mag>\n" +
        "                <type>ml</type>\n" +
        "                <originID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021ebwh</originID>\n" +
        "            </magnitude>\n" +
        "            <origin publicID=\"smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021ebwh\">\n" +
        "                <time>\n" +
        "                    <value>2021-10-01T17:38:46.4351Z</value>\n" +
        "                    <uncertainty>0.092679</uncertainty>\n" +
        "                </time>\n" +
        "                <longitude>\n" +
        "                    <value>53.3585</value>\n" +
        "                </longitude>\n" +
        "                <latitude>\n" +
        "                    <value>51.3265</value>\n" +
        "                </latitude>\n" +
        "                <depthType>from location</depthType>\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>IPGGSBRAS</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:12.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <depth>\n" +
        "                    <value>4793</value>\n" +
        "                    <uncertainty>517.764</uncertainty>\n" +
        "                </depth>\n" +
        "            </origin>\n" +
        "            <preferredOriginID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021ebwh</preferredOriginID>\n" +
        "            <preferredMagnitudeID>smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021ebwh/ml</preferredMagnitudeID>\n" +
        "            <type>earthquake</type>\n" +
        "        </event>\n" +
        "        <event publicID=\"smi:ippg_nsk.ippg.org/event/ipggsbrasippg2021fulf\">\n" +
        "            <typeCertainty>known</typeCertainty>\n" +
        "            <creationInfo>\n" +
        "                <agencyID>IPGGSBRAS</agencyID>\n" +
        "                <creationTime>2022-03-29T16:10:12.0000Z</creationTime>\n" +
        "            </creationInfo>\n" +
        "            <magnitude publicID=\"smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021fulf/ml\">\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>ipggsbras</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:12.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <mag>\n" +
        "                    <value>1.5</value>\n" +
        "                </mag>\n" +
        "                <type>ml</type>\n" +
        "                <originID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021fulf</originID>\n" +
        "            </magnitude>\n" +
        "            <origin publicID=\"smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021fulf\">\n" +
        "                <time>\n" +
        "                    <value>2021-10-01T04:54:07.268Z</value>\n" +
        "                    <uncertainty>0.210857</uncertainty>\n" +
        "                </time>\n" +
        "                <longitude>\n" +
        "                    <value>53.2162</value>\n" +
        "                </longitude>\n" +
        "                <latitude>\n" +
        "                    <value>51.3364</value>\n" +
        "                </latitude>\n" +
        "                <depthType>from location</depthType>\n" +
        "                <creationInfo>\n" +
        "                    <agencyID>IPGGSBRAS</agencyID>\n" +
        "                    <creationTime>2022-03-29T16:10:12.0000Z</creationTime>\n" +
        "                </creationInfo>\n" +
        "                <depth>\n" +
        "                    <value>3474</value>\n" +
        "                    <uncertainty>1544.11</uncertainty>\n" +
        "                </depth>\n" +
        "            </origin>\n" +
        "            <preferredOriginID>smi:ippg_nsk.ippg.org/origin/ipggsbrasippg2021fulf</preferredOriginID>\n" +
        "            <preferredMagnitudeID>smi:ippg_nsk.ippg.org/magnitude/ipggsbrasippg2021fulf/ml</preferredMagnitudeID>\n" +
        "            <type>earthquake</type>\n" +
        "        </event>\n" +
        "    </eventParameters>\n" +
        "</q:quakeml>"

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
                {/*<Slider*/}
                {/*  label="a-value"*/}
                {/*  onChange={({ value }) => setA_value(value)}*/}
                {/*  value={a_value}*/}
                {/*  min={0.1}*/}
                {/*  max={3}*/}
                {/*  withTooltip*/}
                {/*  step={0.005}*/}
                {/*/>*/}
                <Slider
                  label="b-value"
                  onChange={({ value }) => setB_value(value)}
                  value={b_value}
                  min={0.1}
                  max={3}
                  withTooltip
                  step={0.005}
                />
              </div>
            </div>
          </Theme>
          {selectedGeoEvents &&
            <div className="b_value_plot_wrapper">
              <BValuePlot geoEvents={selectedGeoEvents}
                          b_value={b_value}/>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
