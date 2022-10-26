export function parseStations(data) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data.toString(), "text/xml");

  const stations = [];
  let stationsAlreadyAdded = 0;
  for (let i = 0; i < xmlDoc.getElementsByTagName("Network").length; i++) {
    const network = xmlDoc.getElementsByTagName("Network")[i];
    const stationsXML = network.getElementsByTagName("Station");
    for (let j = 0; j < stationsXML.length; j++) {
      stations[stationsAlreadyAdded + j] = {};
      stations[stationsAlreadyAdded + j].latitude = stationsXML[j].getElementsByTagName("Latitude")[0]
        .childNodes[0].nodeValue;
      stations[stationsAlreadyAdded + j].longitude = stationsXML[j].getElementsByTagName("Longitude")[0]
        .childNodes[0].nodeValue;
      stations[stationsAlreadyAdded + j].elevation = stationsXML[j].getElementsByTagName("Elevation")[0]
        .childNodes[0].nodeValue;
      stations[stationsAlreadyAdded + j].code = stationsXML[j].getAttribute("code");
      stations[stationsAlreadyAdded + j].networkCode = network.getAttribute("code");
    }
    stationsAlreadyAdded += stationsXML.length;
  }

  return stations;
}

export const parseGeoEvents = (data) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data.toString(), "text/xml");

  const events = [];
  const eventsXML = xmlDoc.getElementsByTagName("event");
  for (let i = 0; i < eventsXML.length; i++) {
    // suppose origin and magnitude are always present
    const origin = eventsXML[i].getElementsByTagName("origin")[0];
    const magInfo = eventsXML[i].getElementsByTagName("magnitude")[0];
    events[i] = {};
    events[i].type = eventsXML[i].getElementsByTagName("type")?.[1]
      ?.childNodes?.[0]?.nodeValue; // may be missing
    events[i].networkCode = eventsXML[i].getElementsByTagName("pick")?.[0]
      ?.getElementsByTagName("waveformID")?.[0]
      ?.getAttribute("networkCode"); // may be missing
    events[i].magnitudeType = magInfo.getElementsByTagName("type")[0]
      .childNodes[0].nodeValue; // always present
    events[i].magnitude = magInfo.getElementsByTagName("value")[0]
      .childNodes[0].nodeValue; // always present
    events[i].time = origin.getElementsByTagName("time")[0]
      .getElementsByTagName("value")[0]
      .childNodes[0].nodeValue; // always present
    events[i].latitude = origin.getElementsByTagName("latitude")[0]
      .getElementsByTagName("value")[0]
      .childNodes[0].nodeValue; // always present
    events[i].longitude = origin.getElementsByTagName("longitude")[0]
      .getElementsByTagName("value")[0]
      .childNodes[0].nodeValue; // always present
    events[i].depthType = origin.getElementsByTagName("depthType")?.[0]
      ?.childNodes?.[0]?.nodeValue; // may be missing
    events[i].depth = origin.getElementsByTagName("depth")?.[0]
      ?.getElementsByTagName("value")?.[0]
      ?.childNodes?.[0]?.nodeValue; // may be missing
    events[i].depthUncertainty = origin.getElementsByTagName("depth")?.[0]
      ?.getElementsByTagName("uncertainty")?.[0]
      ?.childNodes[0]?.nodeValue; // may be missing
    events[i].selectedOnMap = false;
  }

  return events;
}
