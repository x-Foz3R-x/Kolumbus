import "./checkbox.css";

interface Props {
  isChecked?: boolean;
  setIsChecked?: Function;
  formObject?: { isChecked: boolean };
  setFormObject?: Function;
  formKey?: string;
  children: React.ReactNode;
}

export default function Checkbox({
  isChecked,
  setIsChecked,
  formObject,
  setFormObject,
  formKey = "",
  children,
}: Props) {
  const handleChange = () => {
    if (setIsChecked && isChecked) {
      setIsChecked((prevStatus: boolean) => !prevStatus);
    }
    if (setFormObject && formObject) {
      setFormObject({
        ...formObject,
        [formKey]: !formObject.isChecked,
      });
    }
  };

  return (
    <label className="control m-auto mt-6 h-6 text-sm">
      {children}

      <input
        type="checkbox"
        id="checkbox"
        name="checkbox"
        onChange={handleChange}
        checked={formObject ? formObject.isChecked : isChecked}
        className="absolute -z-10 opacity-0"
      ></input>

      <div className="control_indicator duration-200 ease-kolumb-flow after:duration-500 after:ease-kolumb-flow"></div>
    </label>
  );
}
