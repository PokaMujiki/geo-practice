import "../styles/textfield_wth_caption.css";
import React from "react";

export const TextFieldLeftCaption = ({ caption, ...props }) => {
  return (
    <div className="textfield_with_caption">
      <p>{caption}</p>
      <input className="textfield_with_caption__textfield" {...props} />
    </div>
  );
};
