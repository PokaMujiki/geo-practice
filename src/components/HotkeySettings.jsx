import React, { useState } from "react";
import "../styles/hotkey-settings.css";

import {
  getMapAreaSelectionHotkey,
  getEnterLeaveProfileCreatingModeHotkey,
  getDeleteLatestProfileHotkey,
  LS_NAME_ENTER_LEAVE_PROFILE_CREATING_MODE_HOTKEY,
  LS_NAME_DELETE_LATEST_PROFILE_HOTKEY,
  LS_NAME_MAP_AREA_SELECTION_HOTKEY,
} from "../lib/hotkeys";
import { TextFieldLeftCaption } from "./TextFieldLeftCaption";

export const HotkeySettings = () => {
  const [mapAreaHotkeyValue, setMapAreaHotkeyValue] = useState(
    getMapAreaSelectionHotkey()
  );
  const [profileCreationModeHotkeyValue, setProfileCreationModeHotkeyValue] =
    useState(getEnterLeaveProfileCreatingModeHotkey());
  const [deleteLatestProfileHotkeyValue, setDeleteLatestProfileHotkeyValue] =
    useState(getDeleteLatestProfileHotkey());

  const handleHotkeyChange = (e, hotkeyName) => {
    let { value } = e.target;
    let saveChanges = false;

    if (value.length > 0) {
      value = value[value.length - 1];
      saveChanges = true;
    }

    switch (hotkeyName) {
      case "mapAreaHotkey":
        setMapAreaHotkeyValue(value);
        if (saveChanges) {
          localStorage.setItem(LS_NAME_MAP_AREA_SELECTION_HOTKEY, value);
        }
        break;
      case "profileCreationModeHotkey":
        setProfileCreationModeHotkeyValue(value);
        if (saveChanges) {
          localStorage.setItem(
            LS_NAME_ENTER_LEAVE_PROFILE_CREATING_MODE_HOTKEY,
            value
          );
        }
        break;
      case "deleteLatestProfile":
        setDeleteLatestProfileHotkeyValue(value);
        if (saveChanges) {
          localStorage.setItem(LS_NAME_DELETE_LATEST_PROFILE_HOTKEY, value);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="hotkey-settings">
      <p>Hotkey Settings</p>
      <TextFieldLeftCaption
        caption="Enter/leave profile creation mode hotkey:"
        type="text"
        value={profileCreationModeHotkeyValue}
        onChange={(e) => handleHotkeyChange(e, "profileCreationModeHotkey")}
      />
      <TextFieldLeftCaption
        caption="Delete latest profile(works only in profile creation mode):"
        type="text"
        value={deleteLatestProfileHotkeyValue}
        onChange={(e) => handleHotkeyChange(e, "deleteLatestProfile")}
      />
    </div>
  );
};
