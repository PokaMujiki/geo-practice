import React, { useState } from "react";
import "../styles/positive_number_input.css";

export const PositiveNumberInput = ({ initialValue, setValue, ...props }) => {
  const [displayedValue, setDisplayedValue] = useState(initialValue);

  const onChange = (event) => {
    const inputValue = event.target.value;
    // remove any non-digit characters except for decimal points
    let almostValue = inputValue.replace(/[^\d.]/g, "");

    // check for multiple decimal points
    const decimalCount = almostValue.split(".").length - 1;
    if (decimalCount > 1) {
      return;
    }

    if (almostValue === "" || almostValue.indexOf("-") === -1) {
      setDisplayedValue(almostValue);

      if (
        almostValue.charAt(almostValue.length - 1) !== "." &&
        almostValue.charAt(0) !== "." &&
        almostValue > 0.0000001
      ) {
        setValue(Number(almostValue));
      }
    }
  };

  return (
    <input
      value={displayedValue}
      onChange={onChange}
      className="positive_number_input"
      {...props}
    />
  );
};
