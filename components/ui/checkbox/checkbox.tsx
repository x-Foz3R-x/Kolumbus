import React from "react";

import "./checkbox.css";

interface Props {
  children: React.ReactNode;
  isChecked?: boolean;
  setIsChecked?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Checkbox({ children, isChecked, setIsChecked }: Props) {
  const handleChange = () => {
    if (setIsChecked) setIsChecked((prevStatus: any) => !prevStatus);
  };

  return (
    <label className="control m-auto mt-6 h-6 text-sm">
      {children}

      <input
        type="checkbox"
        onChange={handleChange}
        checked={isChecked}
        className="absolute -z-10 opacity-0"
      ></input>

      <div className="control_indicator duration-200 ease-kolumb-flow after:duration-500 after:ease-kolumb-flow"></div>
    </label>
  );
}
