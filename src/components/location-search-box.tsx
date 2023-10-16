import React, { useEffect, useRef, useState } from "react";

import api from "@/app/_trpc/client";
import { useCloseTriggers, useListNavigation } from "@/hooks/use-accessibility-features";
import { Language, PlaceAutocompletePrediction } from "@/types";

import Combobox from "./ui/combobox";
import Divider from "./ui/divider";
import Icon from "./icons";
import { set } from "zod";

type List = [searchValue: { searchValue: string }, ...predictions: PlaceAutocompletePrediction[]];

type LocationSearchBoxProps = {
  onAdd: Function;
  placeholder: string;
  sessionToken: string;
};
export default function LocationSearchBox({ onAdd, placeholder, sessionToken }: LocationSearchBoxProps) {
  const getAutocomplete = api.google.autocomplete.useMutation();

  const [searchValue, setSearchValue] = useState("");
  const [predictionList, setPredictionList] = useState<List>([{ searchValue }]);
  const [selectedPrediction, setSelectedPrediction] = useState<{ searchValue: string } | PlaceAutocompletePrediction>({ searchValue });
  const [isListDisplayed, setListDisplay] = useState(false);

  //#region Handlers
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);

    if (e.target.value.length < 3) {
      ClearPredictions();
      return;
    }

    // todo: handling all return data statuses
    getAutocomplete.mutate(
      {
        searchValue: e.target.value,
        language: Language.English,
        sessionToken,
      },
      {
        onSettled(data) {
          if (typeof data === "undefined") return;

          if (data.status === "OK" && data.predictions.length > 0) {
            setPredictionList([{ searchValue: e.target.value }, ...data.predictions]);
            setSelectedIndex(0);
            setListDisplay(true);
          }
          // else if(data.status === .ZERO_RESULTS){}
          // else if(data.status === .INVALID_REQUEST){}
          // else if(data.status === .OVER_QUERY_LIMIT){}
          // else if(data.status === .REQUEST_DENIED){}
          // else if(data.status === .UNKNOWN_ERROR){}
        },
      }
    );
  };

  const handleInputFocus = () => {
    if (predictionList.length > 1) setListDisplay(true);
  };

  const handleIndexChange = (selectedPrediction: { searchValue: string } | PlaceAutocompletePrediction) => {
    setSelectedPrediction(selectedPrediction);

    if ("searchValue" in selectedPrediction) setSearchValue(selectedPrediction.searchValue);
    else setSearchValue(selectedPrediction.structured_formatting.main_text);
  };

  const handlePredictionSelect = (selectedPrediction: { searchValue: string } | PlaceAutocompletePrediction) => {
    setSelectedPrediction(selectedPrediction);
    setListDisplay(false);

    if ("searchValue" in selectedPrediction) return;

    setSearchValue(selectedPrediction.structured_formatting.main_text);
    setPredictionList([{ searchValue: selectedPrediction.structured_formatting.main_text }]);
    setSelectedIndex(0);
  };
  //#endregion

  const ClearPredictions = () => {
    setPredictionList([{ searchValue }]);
    setListDisplay(false);
    setSelectedIndex(0);
  };

  const ref = useRef<HTMLDivElement | null>(null);
  useCloseTriggers(ref, () => setListDisplay(false));
  const { selectedIndex, setSelectedIndex } = useListNavigation(predictionList, isListDisplayed, handleIndexChange, handlePredictionSelect);

  return (
    <Combobox.Root ref={ref} name="PlaceAutocomplete" isExpanded={isListDisplayed}>
      <Combobox.Input
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        className={`bg-gray-50 fill-gray-400 text-sm text-gray-400 outline-0 ${
          isListDisplayed ? "duration-[375ms] ease-kolumb-flow" : "rounded-b-lg duration-300 ease-kolumb-leave"
        }`}
      >
        <button
          onClick={() => {
            setSearchValue("");
            ClearPredictions();
          }}
          className="h-8 w-6 px-2 duration-100 hover:fill-gray-700"
        >
          <Icon.x className="w-2 " />
        </button>

        <Divider orientation="vertical" className="absolute left-6 h-4" />

        <button
          onClick={() => onAdd("searchValue" in selectedPrediction ? { searchValue } : selectedPrediction)}
          className="flex h-8 items-center justify-center gap-1 px-2 duration-100 hover:fill-gray-700 hover:text-gray-700"
        >
          <Icon.plus className="w-[10px]" />
          <p className="text-xs font-medium">Add</p>
        </button>
      </Combobox.Input>

      {
        // todo: correct animations when using arrows (when index = 0 and arrow up is pressed div should show up from bottom)
      }
      <Combobox.List
        listHeight={(predictionList.length - 1) * 52 + 12} // numberOfPredictions * comboboxOptionHeight + padding
        className={`rounded-b-[0.625rem] p-1.5 shadow-borderXl ${
          isListDisplayed
            ? "scale-y-100 duration-[375ms] ease-kolumb-flow"
            : "-translate-y-6 scale-x-95 scale-y-[0.3] duration-300 ease-kolumb-leave"
        }`}
      >
        <Predictions
          predictionList={predictionList}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          handleClick={handlePredictionSelect}
        />
        <div
          style={{ top: (selectedIndex - 1) * 52 + 6 }}
          className={`absolute left-1.5 right-1.5 -z-10 h-[3.25rem] rounded bg-gray-100 shadow-select duration-200 ease-kolumb-flow ${
            selectedIndex === 0 && "opacity-0 duration-0"
          }`}
        ></div>
      </Combobox.List>
    </Combobox.Root>
  );
}

// todo: include flags countries
type PredictionsProps = {
  predictionList: List;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  handleClick: (prediction: PlaceAutocompletePrediction) => void;
};
function Predictions({ predictionList, selectedIndex, setSelectedIndex, handleClick }: PredictionsProps) {
  const predictions = predictionList.slice(1) as PlaceAutocompletePrediction[];

  return (
    <>
      {predictions.map((prediction, index) => {
        const key = index + prediction.description;
        const animationDelay = index * 50;

        return (
          <Combobox.Option
            key={key}
            isSelected={selectedIndex === index + 1} // +1 to omit first index as its user input not prediction
            onClick={() => handleClick(prediction)}
            onMouseMove={() => setSelectedIndex(index + 1)} // +1 to omit first index as its user input not prediction
            onMouseLeave={() => setSelectedIndex(0)}
            animationDelay={animationDelay}
            className={`animate-slideIn gap-4 rounded fill-gray-400 px-4 py-2`}
          >
            <Icon.pin className="w-[0.625rem] flex-shrink-0" />

            <div className="h-9 w-[10.625rem] text-left">
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-900">
                {prediction.structured_formatting.main_text}
              </div>
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500">
                {prediction.structured_formatting.secondary_text}
              </div>
            </div>
          </Combobox.Option>
        );
      })}
    </>
  );
}
