import React from "react";
import "../styles/about.css";

export const About = () => {
  return (
    <div className="about-container">
      <div className="about-wrapper">
        <h2>Overview</h2>
        <div className="overview">
          <p>
            <a href="#map">Map</a>
          </p>
          <p>
            <a href="#start-b-value">
              Start working with b-value approximation
            </a>
          </p>
          <p>
            <a href="#b-value-plot">Working with b-value plot</a>
          </p>
          <p>
            <a href="#event-catalogue">Events catalogue</a>
          </p>
          <p>
            <a href="#linear-profiles">
              Visualization of distribution of hypocenters along linear profiles
            </a>
          </p>
          <p>
            <a href="#events-by-time">
              Graph of the distribution of events by time
            </a>
          </p>
        </div>
        <h2 id="map">Map</h2>
        <p>
          Map is interactive and can be navigated using the left mouse button,
          the zoom in and zoom out buttons located at the top left corner of the
          map, besides mouse wheel can be used. To use the mouse wheel for
          navigating on the map, map must be "targeted" - that is, the last
          click on the page must be on the map area. To remove the "targeting"
          from the map, you should click anywhere else outside the map. The
          mouse wheel will then be used to navigate the page rather than the
          map.
        </p>
        <p>
          When you load the page, the seismic data are automatically requested
          for the last 2 weeks with the default limit of 2000 events. The period
          for which the data are requested, as well as the limit of requested
          seismic events can be changed using the fields below the map.
        </p>
        <p>
          After receiving the data, it will be displayed on the map in the form
          of red circles, as well as in the catalog of events, located on the
          right side of the page. The radius of the circles representing seismic
          events is dynamic and depends on the event magnitude. Each seismic
          event on the map as well as the stations are interactive - you can
          click on them and brief information will be displayed inside a pop-up
          window. For seismic events: event type, date, its coordinates
          (longitude and latitude), depth, and depth uncertainty. The absence of
          any information in the pop-up window means that it was not received
          from the server.
        </p>
        <p>
          In the upper right corner of the map there is an option to turn on/off
          the display of seismic events and stations, as well as a ruler.
        </p>
        <h2 id="start-b-value">Start working with b-value approximation</h2>
        <p>
          To start working with b-value it is required to select some area on
          the map. It can be done by holding the "left control" key. After
          selecting the area, the events caught in the selection will be colored
          blue on the map, and below the map will appear a plot with the
          possibility of approximation of b-value.
        </p>
        <h2 id="b-value-plot">Working with b-value plot</h2>
        <p>
          To the left of the graph is a panel that allows you to change the step
          at which the points where the line is approximated are drawn. In
          addition, the panel contains already approximated values of a-value
          and b-value.
        </p>
        <p>
          Plot itself consists of points, by which the approximation is made,
          and the line which displays the result of approximation. The least
          squares method is used to approximate it.
        </p>
        <p>
          User has the ability to exclude points at top and bottom. It may be
          done by clicking at the point on the plot. If the clicked point is in
          the upper part of the graph, the points above it are excluded.
          Excluded points are colored orange and do not participate in the
          approximation. At that, the excluded points can be included again in
          the approximation process. If user clicks on the orange point, all
          points in the upper half of the graph below it, including clicked
          point itself, are included in the approximation process. The operation
          of including/excluding points to the approximation is similarly
          available for points located at the bottom part of the plot.
        </p>
        <h2 id="event-catalogue">Events catalogue</h2>
        <p>
          Events catalogue contains all the events displayed on the map. For
          each event brief information is displayed like in pop-up at map. In
          addition, on the card of each event there is a button that allows you
          to center the map on this event. Catalog can be sorted using the
          buttons located in its upper part. Sorting is possible by two criteria
          - by time and by magnitude, in both cases sorting may be done in
          ascending or descending order. Arrows at the top shows the current
          sorting type. In addition, an option is available that allows you to
          display selected on the map events first. Such events have a blue
          border on its card.
        </p>
        <h2 id="linear-profiles">
          Visualization of distribution of hypocenters along linear profiles
        </h2>
        <p>
          Application has the ability to create linear profiles on which seismic
          events are projected. This function allows you to see the distribution
          of events in a cutaway.
        </p>
        <p>
          In order to create a profile you need to enter "profile creation
          mode". By default it is done by pressing the key "p", this key can be
          changed in the settings. In this mode it is possible to create a
          straight line on which the events will be projected, for this purpose
          it is enough to click the left mouse button in two places of the map.
          You can also exit "profile creation mode" by pressing the "p" key.
        </p>
        <p>
          To delete the latest created profile, it is necessary to press "d"
          while being in a "profile creation mode".
        </p>
        <p>
          After creating a profile, under the map there will be a plot, as well
          as a block with information and an input field that adjusts the width
          of the profile. In addition, there is an option to enable/disable the
          ability to display events depth uncertainty. When hovering over the
          event on the plot, it displays brief information about this event.
        </p>
        <p>More than one linear profile may be created.</p>
        <h2 id="events-by-time">Graph of the distribution of events by time</h2>
        <p>
          Plot at the bottom of the application shows the distribution of events
          over time. The abscissa axis shows the dates, the ordinate axis shows
          the magnitude of the events.
        </p>
        <p>
          All the plots in the application have the ability to zoom in and out
          of an rectangular area.
        </p>
      </div>
    </div>
  );
};
