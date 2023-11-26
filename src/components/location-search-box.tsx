import React, { useEffect, useRef, useState } from "react";

import api from "@/app/_trpc/client";
import { Language, PlaceAutocompletePrediction } from "@/types";

import Icon from "./icons";
import Combobox, { ComboboxList } from "./ui/combobox";
import Button from "./ui/button";
import Divider from "./ui/divider";
import Tooltip, { useTooltip } from "./ui/tooltip";
import Input from "./ui/input";

type LocationSearchBoxProps = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAdd: Function;
  placeholder: string;
  sessionToken: string;
};
export default function LocationSearchBox({ isOpen, setOpen, onAdd, placeholder, sessionToken }: LocationSearchBoxProps) {
  const getAutocomplete = api.google.autocomplete.useMutation();

  const [value, setValue] = useState("");
  const list = useRef<ComboboxList<PlaceAutocompletePrediction>>([{ index: 0, data: "" }]);

  // todo: Add <Toast> component to display errors
  const handleSearchInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 3) {
      ClearPredictions();
      return;
    }

    getAutocomplete.mutate(
      { searchValue: e.target.value, language: Language.English, sessionToken },
      {
        onSuccess(data) {
          if (data.status === "OK") {
            const predictions = data.predictions.map((prediction, index) => ({ index: index + 1, data: prediction }));
            list.current = [{ index: 0, data: e.target.value }, ...predictions];
            setOpen(true);
          } else if (data.status === "ZERO_RESULTS") {
            list.current = [{ index: 0, data: e.target.value }];
            setOpen(true);
          } else {
            console.error(`Google Places API returned status: ${data.status}.`);
            console.error(`Please contact me at pawel@kolumbus.app with API status to resolve this issue.`);
          }
        },
      },
    );
  };

  const ClearPredictions = (reset = false) => {
    if (reset) setValue("");
    list.current = [{ index: 0, data: value }];
    setOpen(false);
  };

  // const handleIndexChange = (selectedPrediction: { searchValue: string } | PlaceAutocompletePrediction) => {
  //   setSelectedPrediction(selectedPrediction);

  //   if ("searchValue" in selectedPrediction) setSearchValue(selectedPrediction.searchValue);
  //   else setSearchValue(selectedPrediction.structured_formatting.main_text);
  // };

  return (
    <Combobox.Root isOpen={isOpen} setOpen={setOpen} list={list.current} className="shadow-smI">
      <Input value={value} setValue={setValue} />
      <Combobox.Input
        placeholder={placeholder}
        value={value}
        setValue={setValue}
        onInput={handleSearchInput}
        onFocus={() => !(typeof value === "string" && value.length < 3) && setOpen(true)}
        className={`bg-gray-50 text-sm shadow-sm duration-300 ease-kolumb-flow ${!isOpen && "rounded-b-lg"}`}
      >
        <Button
          onClick={() => ClearPredictions(true)}
          variant="unstyled"
          className="h-8 w-6 fill-gray-400 px-2 duration-100 hover:fill-gray-700"
        >
          <Icon.x className="w-2" />
        </Button>

        <Divider orientation="vertical" gradient className="absolute left-6 h-6" />

        <Button
          // onClick={() => onAdd("searchValue" in selectedPrediction ? { searchValue } : selectedPrediction)}
          variant="unstyled"
          className="flex h-8 items-center justify-center gap-1 fill-gray-400 pl-1 pr-2 text-gray-400 duration-100 hover:fill-gray-700 hover:text-gray-700"
        >
          <Icon.plus className="w-2.5" />
          <p className="text-xs font-medium">Add</p>
        </Button>
      </Combobox.Input>

      <Combobox.List>
        {list.current.map((prediction, index) => {
          if (typeof prediction.data === "string") return null;
          return <Prediction key={prediction.index} index={index} prediction={prediction.data} />;
        })}

        {list.current.length === 1 && <p className="px-2 py-1 text-sm text-gray-400">No results found</p>}
      </Combobox.List>
    </Combobox.Root>
  );
}

function Prediction({ index, prediction }: { index: number; prediction: PlaceAutocompletePrediction }) {
  const { isOpen, setOpen, position, handleMouseEnter, handleMouseMove, handleMouseLeave } = useTooltip();

  return (
    <>
      <Combobox.Option
        index={index}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="before:scale-x-50 before:scale-y-75 before:rounded-lg before:duration-200"
      >
        <Icon.pin className="w-2.5 fill-gray-400" />

        <div className="group/option flex h-9 w-44 flex-col justify-center text-left text-sm">
          <p className="pointer-events-none w-full truncate">{prediction.structured_formatting.main_text}</p>
          {prediction.structured_formatting.secondary_text && (
            <p className="pointer-events-none w-full truncate text-xs text-gray-500">{prediction.structured_formatting.secondary_text}</p>
          )}
        </div>
      </Combobox.Option>

      <Tooltip isOpen={isOpen} setOpen={setOpen} position={position}>
        <p className="text-xs">{prediction.structured_formatting.main_text}</p>
        {prediction.structured_formatting.secondary_text && (
          <p className="text-xs text-gray-400">{prediction.structured_formatting.secondary_text}</p>
        )}
      </Tooltip>
    </>
  );
}
