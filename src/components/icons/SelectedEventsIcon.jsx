import React from "react";
import {
  DEFAULT_GEO_EVENT_FILL_COLOR,
  DEFAULT_ICON_HEIGHT,
  DEFAULT_ICON_WIDTH,
} from "../../lib/constants";

export const SelectedEventsIcon = ({
  width = DEFAULT_ICON_WIDTH,
  height = DEFAULT_ICON_HEIGHT,
  circlesFill = DEFAULT_GEO_EVENT_FILL_COLOR,
  onClick,
}) => {
  return (
    <svg
      width={width}
      height={height}
      onClick={onClick}
      viewBox="0 0 170 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="10"
        y="10"
        width="150"
        height="150"
        rx="30"
        stroke="#BBC3C8"
        strokeWidth="15"
      />
      <path
        d="M67.5 45.5878C67.5 53.596 61.0081 60.0878 53 60.0878C44.9919 60.0878 38.5 53.596 38.5 45.5878C38.5 37.5797 44.9919 31.0878 53 31.0878C61.0081 31.0878 67.5 37.5797 67.5 45.5878Z"
        fill={circlesFill}
        fillOpacity="0.5"
      />
      <path
        d="M82 52C82 60.0081 75.5081 66.5 67.5 66.5C59.4919 66.5 53 60.0081 53 52C53 43.9919 59.4919 37.5 67.5 37.5C75.5081 37.5 82 43.9919 82 52Z"
        fill={circlesFill}
        fillOpacity="0.5"
      />
      <path
        d="M111 106.5C111 114.508 104.508 121 96.5 121C88.4919 121 82 114.508 82 106.5C82 98.4919 88.4919 92 96.5 92C104.508 92 111 98.4919 111 106.5Z"
        fill={circlesFill}
        fillOpacity="0.5"
      />
      <circle
        cx="124.5"
        cy="92.5"
        r="14.5"
        fill={circlesFill}
        fillOpacity="0.5"
      />
      <circle
        cx="116.5"
        cy="51.5"
        r="10.5"
        fill={circlesFill}
        fillOpacity="0.5"
      />
      <circle cx="106" cy="62" r="19" fill={circlesFill} fillOpacity="0.5" />
      <path
        d="M63.1304 112.42C63.1525 120.428 56.6785 126.938 48.6704 126.96C40.6623 126.982 34.1526 120.508 34.1305 112.5C34.1084 104.492 40.5824 97.9822 48.5905 97.9601C56.5986 97.938 63.1083 104.412 63.1304 112.42Z"
        fill={circlesFill}
        fillOpacity="0.5"
      />
      <circle cx="85" cy="97" r="11" fill={circlesFill} fillOpacity="0.5" />
    </svg>
  );
};
