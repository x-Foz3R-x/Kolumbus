interface RadioListProps {
  title?: string;
  name: string;
  setValue: Function;
  options: { display_name?: string; value?: any; element: React.ReactElement }[];
}
export function RadioIconsInline({ title, name, setValue, options }: RadioListProps) {
  return (
    <section className="flex flex-col items-center justify-between">
      <h2 className="cursor-default text-xs font-medium capitalize text-kolumbGray-500">{title && title}</h2>

      <ul className="flex items-center rounded-md bg-kolumbGray-50 px-1 shadow-sm">
        {options.map((option, index) => (
          <li
            key={`option_${index}`}
            onChange={() => {
              setValue(option?.value);
            }}
            className="flex items-center"
          >
            <input
              type="radio"
              name={name}
              id={`${name}-${index}`}
              defaultChecked={index === 0}
              className="peer hidden"
            />

            <label
              htmlFor={`${name}-${index}`}
              className={`group relative flex-1 cursor-pointer select-none rounded-[0.625rem] fill-kolumbGray-400 p-1 capitalize text-kolumbGray-500 duration-200 ease-kolumb-flow hover:scale-110 hover:fill-kolumbGray-500 peer-checked:fill-kolumblue-500`}
            >
              {option.element}
              <span className="pointer-events-none absolute bottom-[26px] left-1/2 z-20 -translate-x-1/2 scale-90 rounded bg-kolumbGray-50/70 px-1 py-[2px] text-center text-kolumbGray-500 opacity-0 shadow-xl backdrop-blur-[2px] backdrop-saturate-[180%] backdrop-filter duration-150 ease-kolumb-flow group-hover:opacity-100">
                {option?.display_name}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface radioGridCardsProps {
  title?: string;
  options: string[];
}
export function RadioGridCards({ title, options }: radioGridCardsProps) {
  return (
    <section className="flex flex-col gap-1">
      {title && <h2 className="capitalize">{title}</h2>}

      <ul className="flex w-32 flex-col items-start">
        {options.map((option, index) => (
          <li key={`option_${index}`} className="duration-200 ease-kolumb-overflow hover:scale-105">
            <input
              type="radio"
              name={title}
              id={option}
              defaultChecked={index === 0}
              className="peer hidden"
            />

            <label
              htmlFor={option}
              className="flex-1 select-none rounded-lg bg-kolumbGray-100 px-2 py-1 capitalize text-kolumbGray-800 shadow-btn peer-checked:bg-kolumblue-300 "
            >
              {option}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
