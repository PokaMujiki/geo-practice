import React from "react";
import {DEFAULT_ICON_FILL_COLOR, DEFAULT_ICON_HEIGHT, DEFAULT_ICON_WIDTH} from "../../lib/constants";

export const ArrowUpIcon = ({width = DEFAULT_ICON_WIDTH, height = DEFAULT_ICON_HEIGHT, fill = DEFAULT_ICON_FILL_COLOR, onClick}) => {
  return (
    <svg width={width}
         height={height}
         fill={fill}
         onClick={onClick}
         viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <title>arrow-up</title>
      <g id="directional" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="arrow-up" fill="#bbc3c8">
          <polygon id="Shape" points="4 15 12 7 20 15 18 17 12 11 6 17"></polygon>
        </g>
      </g>
    </svg>
  );
}