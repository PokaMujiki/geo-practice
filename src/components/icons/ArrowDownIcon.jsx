import React from "react";
import {DEFAULT_ICON_FILL_COLOR, DEFAULT_ICON_HEIGHT, DEFAULT_ICON_WIDTH} from "../../lib/constants";

export const ArrowDownIcon = ({width = DEFAULT_ICON_WIDTH, height = DEFAULT_ICON_HEIGHT, fill = DEFAULT_ICON_FILL_COLOR, onClick}) => {
  return (
    <svg width={width}
         height={height}
         fill={fill}
         onClick={onClick}
         viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <title>arrow-down</title>
      <g id="directional" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="arrow-down" fill="#bbc3c8">
          <polygon id="Shape" points="6 7 12 13 18 7 20 9 12 17 4 9"></polygon>
        </g>
      </g>
    </svg>
  );
}