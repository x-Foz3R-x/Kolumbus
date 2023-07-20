import { useRef, useState } from "react";
import axios from "axios";

import useAccessibilityFeatures from "@/hooks/use-accessibility-features";
import useArrowNavigation from "@/hooks/use-keyboard-navigation";

import Icon from "./icons";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxList,
} from "./ui/combobox";

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: { main_text: string; secondary_text: string };
  terms: { offset: number; value: string }[];
  types: string[];
}

interface Props {
  placeholder: string;
}
export default function GoogleMapsSearch({ placeholder }: Props) {
  const [value, setValue] = useState<string>("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [prevPredictions, setPrevPredictions] = useState<PlacePrediction[]>([]);
  const [arePredictionsShown, setPredictionsShown] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectList, setSelectList] = useState<{ value: string }[]>([
    { value: value },
  ]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    if (e.target.value.length < 3) {
      ClearPredictions();
      return;
    }

    try {
      interface apiData {
        data: { status: string; predictions: PlacePrediction[] };
      }
      const { data }: apiData = await axios.post("/api/autocomplete", {
        inputValue: e.target.value,
      });

      setPrevPredictions(predictions);

      if (data.status === "OK" && data.predictions.length > 0) {
        setPredictions([...data.predictions]);
        setSelectList([
          { value },
          ...data.predictions.map((prediction) => ({
            value: prediction.structured_formatting.main_text,
          })),
        ]);

        setSelectedIndex(0);
        setPredictionsShown(true);
      }
    } catch (error) {
      console.log("An error occurred: ", error);
    }
  };

  const handleSearchFocus = () => {
    if (predictions.length > 0) setPredictionsShown(true);
  };

  const handlePredictionSelect = (predictionValue: string) => {
    const updatedSelectList = [...selectList];
    updatedSelectList[0].value = predictionValue;
    setSelectList(updatedSelectList);

    setValue(predictionValue);
    setSelectedIndex(0);
    setPredictionsShown(false);
  };

  const ClearPredictions = () => {
    setPredictionsShown(false);
    setTimeout(() => {
      setPredictions([]);
    }, 200);
  };

  const ref = useRef<any>(null);
  useAccessibilityFeatures(ref, () => {
    setPredictionsShown(false);
  });
  useArrowNavigation(
    selectList,
    selectedIndex,
    setSelectedIndex,
    setValue,
    handlePredictionSelect
  );

  return (
    <Combobox
      ref={ref}
      name="GoogleMapsSearch"
      className="shadow-inputInverted"
    >
      <ComboboxInput
        value={value}
        placeholder={placeholder}
        onChange={handleSearchChange}
        onFocus={handleSearchFocus}
        ariaExpanded={arePredictionsShown}
        className={`bg-kolumbGray-50 fill-kolumbGray-400 text-kolumbGray-400 outline-0 ${
          arePredictionsShown
            ? "shadow-input duration-300 ease-kolumb-flow"
            : "rounded-b-[0.625rem] duration-200 ease-kolumb-leave"
        }`}
      >
        <button
          onClick={() => {
            setValue("");
            ClearPredictions();
          }}
          className="h-8 w-6 px-2 hover:fill-kolumbGray-700"
        >
          <Icon.x className="w-2 " />
        </button>

        <div className="absolute left-6 top-2 h-4 border-r border-kolumbGray-200"></div>

        <button className="flex h-8 items-center justify-center gap-1 px-2 hover:fill-kolumbGray-700 hover:text-kolumbGray-700">
          <Icon.plus className="w-[10px]" />
          <p className="text-xs font-medium capitalize">add</p>
        </button>
      </ComboboxInput>

      <ComboboxList showWhen={arePredictionsShown} length={predictions?.length}>
        {predictions?.map((prediction, index) => {
          const key = index + prediction.place_id;
          const animationDelay =
            predictions.length !== prevPredictions.length ? "0.3s" : "0";
          const handleClick = () =>
            handlePredictionSelect(prediction.structured_formatting.main_text);

          return (
            <ComboboxOption
              key={key}
              onClick={handleClick}
              isSelected={selectedIndex === index + 1}
              animationDelay={animationDelay}
            >
              <Icon.pin className="w-[0.625rem] flex-shrink-0" />

              <section className="flex h-9 w-[10.625rem] flex-col justify-center">
                <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                  {prediction.structured_formatting.main_text}
                </p>
                <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-kolumbGray-500">
                  {prediction.structured_formatting.secondary_text}
                </p>
              </section>
            </ComboboxOption>
          );
        })}
      </ComboboxList>
    </Combobox>
  );
}
