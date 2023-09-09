import "./checkbox.css";

interface Props {
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

export default function Checkbox({ isChecked, setIsChecked, children }: Props) {
  return (
    <label className="control m-auto h-6 text-sm">
      {children}

      <input
        type="checkbox"
        id="checkbox"
        name="checkbox"
        onChange={() => setIsChecked((prevStatus: boolean) => !prevStatus)}
        checked={isChecked}
        className="absolute -z-10 opacity-0"
      ></input>

      <div className="control_indicator duration-200 ease-kolumb-flow after:duration-500 after:ease-kolumb-flow"></div>
    </label>
  );
}
