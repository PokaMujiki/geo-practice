import React from "react";
import {DEFAULT_ICON_FILL_COLOR} from "../../lib/constants";

export const MagnitudeIcon = ({width = 36, height = 36, fill = DEFAULT_ICON_FILL_COLOR}) => {
  return (
    <svg width={width}
         height={height}
         fill={fill}
         viewBox="0 0 470 269" stroke="#bbc3c8" xmlns="http://www.w3.org/2000/svg">
    <path fill="none"
          strokeWidth="20"
          d="M87.5 134H147.646C148.782 134 149.821 133.358 150.329 132.342L170.699 91.6013C171.903 89.1936 175.424 89.4672 176.241 92.0321L228.652 256.495C229.581 259.408 233.761 259.229 234.436 256.247L289.605 12.7784C290.309 9.66958 294.735 9.6596 295.453 12.7652L322.962 131.676C323.277 133.037 324.489 134 325.885 134H382.5"/>
    <circle cx="45" cy="135" r="45"/>
    <circle cx="425" cy="135" r="45"/>
  </svg>);
}