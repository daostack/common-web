
import React, { ReactElement } from "react";
import "./index.scss";

interface ToggleSwitchProps {
  isChecked: boolean;
  onChange: (toggleState: boolean) => void;
  label: string;
}

export function ToggleSwitch({isChecked, onChange, label}: ToggleSwitchProps): ReactElement {
  return (
    <div className="toggle-switch">
      <label className="toggle-switch__container">
        <input 
          className="toggle-switch__container__checkbox" 
          type="checkbox"   
          checked={isChecked} 
          onChange={() => {
            onChange(!isChecked);
          }} 
        />
        <span className="toggle-switch__container__body" />
      </label>
      <span className="toggle-switch__label">{label}</span>
    </div>
  );
}
