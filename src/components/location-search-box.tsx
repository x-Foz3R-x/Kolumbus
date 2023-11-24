import React, { useRef, useState } from "react";

import api from "@/app/_trpc/client";
import { Language, PlaceAutocompletePrediction } from "@/types";

import Icon from "./icons";
import Combobox, { ComboboxList } from "./ui/combobox";
import Button from "./ui/button";
import Divider from "./ui/divider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

  const handleSearchInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
            const predictions = data.predictions.map((prediction, index) => ({ index: index + 1, data: prediction }));
            list.current = [{ index: 0, data: e.target.value }, ...predictions];
            setOpen(true);
          }
          // else if(data.status === .ZERO_RESULTS){}
          // else if(data.status === .INVALID_REQUEST){}
          // else if(data.status === .OVER_QUERY_LIMIT){}
          // else if(data.status === .REQUEST_DENIED){}
          // else if(data.status === .UNKNOWN_ERROR){}
        },
      },
    );
  };

  const ClearPredictions = (reset = false) => {
    if (reset) setValue("");
    list.current = [{ index: 0, data: value }];
    setOpen(false);
  };

  const [delayedHover, setDelayedHover] = useState(false);

  const handleMouseEnter = () => {
    setTimeout(() => {
      setDelayedHover(true);
    }, 1250);
  };

  const handleMouseLeave = () => {
    setDelayedHover(false);
  };

  return (
    <Combobox.Root isOpen={isOpen} setOpen={setOpen} list={list.current} className="shadow-smI">
      <Combobox.Input
        placeholder={placeholder}
        value={value}
        setValue={setValue}
        onInput={handleSearchInput}
        onFocus={() => list.current.length > 1 && setOpen(true)}
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

      <Combobox.List className="rounded-b-lg">
        {list.current.map((prediction, index) => {
          // todo: include flags countries
          if (index === 0 || typeof prediction.data === "string") return null;

          console.log(delayedHover);

          return (
            <Combobox.Option
              key={prediction.index}
              index={index}
              className="before:scale-x-50 before:scale-y-75 before:rounded-lg before:duration-200"
            >
              <Icon.pin className="w-2.5 fill-gray-400" />

              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="group/option flex h-9 w-44 flex-col justify-center text-left text-sm"
              >
                <span className={cn("w-full truncate", delayedHover && "group-hover/option:overflow-visible group-hover/option:text-clip")}>
                  {prediction.data.structured_formatting.main_text}
                </span>
                {prediction.data.structured_formatting.secondary_text && (
                  <span
                    className={cn(
                      "w-full truncate text-xs text-gray-500",
                      delayedHover && "group-hover/option:overflow-visible group-hover/option:text-clip",
                    )}
                  >
                    {prediction.data.structured_formatting.secondary_text}
                  </span>
                )}
              </div>
            </Combobox.Option>
          );
        })}
      </Combobox.List>
    </Combobox.Root>
  );
}
