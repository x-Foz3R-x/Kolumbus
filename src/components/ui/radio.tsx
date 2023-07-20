interface RadioListProps {
  title?: string;
  setValue: Function;
  name: string;
  options: { name?: string; value?: any; element: React.ReactElement }[];
}

export function RadioIconsInline({
  title,
  setValue,
  name,
  options,
}: RadioListProps) {
  return (
    <section className="flex flex-col items-start justify-between">
      {title && (
        <h2 className="mb-1 cursor-default text-xs font-medium capitalize text-kolumbGray-500">
          {`${title} ${options[0].name}`}
        </h2>
      )}

      <ul className="flex items-center gap-1">
        {options.map((option, index) => (
          <li key={`option_${index}`} className="flex items-center">
            <input
              type="radio"
              name={name}
              id={`${name}-${index}`}
              onChange={() => setValue(option?.value)}
              defaultChecked={index === 0}
              className="peer hidden"
            />

            <label
              htmlFor={`${name}-${index}`}
              className={`group relative flex-1 cursor-pointer select-none rounded-[0.625rem] bg-kolumbGray-300 fill-white p-1 capitalize text-kolumbGray-500 shadow-container duration-200 ease-kolumb-flow hover:scale-110 hover:bg-kolumbGray-400 peer-checked:bg-kolumblue-500`}
            >
              {option.element}
              <span className="pointer-events-none absolute bottom-[26px] left-1/2 z-20 -translate-x-1/2 scale-90 rounded bg-kolumbGray-50/70 px-1 py-[2px] text-center text-kolumbGray-500 opacity-0 shadow-container backdrop-blur-[2px] backdrop-saturate-[180%] backdrop-filter duration-150 ease-kolumb-flow group-hover:opacity-100">
                {option?.name}
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
          <li
            key={`option_${index}`}
            className="duration-200 ease-kolumb-overflow hover:scale-105"
          >
            <input
              type="radio"
              name={title}
              id={option}
              defaultChecked={index === 0}
              className="peer hidden"
            />

            <label
              htmlFor={option}
              className="flex-1 select-none rounded-lg bg-kolumbGray-100 px-2 py-1 capitalize text-kolumbGray-800 shadow-button peer-checked:bg-kolumblue-300 "
            >
              {option}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
