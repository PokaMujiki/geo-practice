import "../styles/textfield_wth_caption.css";
import React from "react";

export const TextFieldLeftCaption = ({ value, setValue, caption, type }) => {
  return (
    <div className="textfield_with_caption">
      <p>{caption}</p>
      <input
        className="textfield_with_caption__textfield"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        type={type}
      />
    </div>
  );
};
