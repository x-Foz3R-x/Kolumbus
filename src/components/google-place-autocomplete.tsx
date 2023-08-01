import React, { useRef, useState } from "react";
import axios from "axios";

import { useEscapeOrOutsideClose, useArrowNavigation } from "@/hooks/use-accessibility-features";
import { PlacesAutocompleteStatus } from "@/types";

import Icon from "./icons";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxList } from "./ui/combobox";

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: { main_text: string; secondary_text: string };
  terms: { offset: number; value: string }[];
  types: string[];
}
type SelectList = [{ value: string }, ...predictions: PlacePrediction[]];
type SelectedItem = PlacePrediction | { value: string };

interface Props {
  onAdd: Function;
  placeholder: string;
}
export default function GooglePlaceAutocomplete({ onAdd, placeholder }: Props) {
  const [value, setValue] = useState("");

  const [selectList, setSelectList] = useState<SelectList>([{ value: value }]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({ value: value });
  const [prevSelectListLength, setPrevSelectListLength] = useState(1);
  const [itSelectListShown, setSelectListShown] = useState(false);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setPrevSelectListLength(selectList.length);

      if (data.status === PlacesAutocompleteStatus.OK && data.predictions.length > 0) {
        setSelectList([{ value: e.target.value }, ...data.predictions]);
        setSelectedItem({ value: e.target.value });

        setSelectedIndex(0);
        setSelectListShown(true);
      }

      // todo handling all data status
      // else if(data.status === PlacesAutocompleteStatus.ZERO_RESULTS){}
      // else if(data.status === PlacesAutocompleteStatus.INVALID_REQUEST){}
      // else if(data.status === PlacesAutocompleteStatus.OVER_QUERY_LIMIT){}
      // else if(data.status === PlacesAutocompleteStatus.REQUEST_DENIED){}
      // else if(data.status === PlacesAutocompleteStatus.UNKNOWN_ERROR){}
    } catch (error) {
      console.log("An error occurred: ", error);
    }
  };

  const handleInputFocus = () => {
    if (selectList.length > 1) setSelectListShown(true);
  };

  // todo add type safety
  const handleIndexChange = (item: any) => {
    setValue(item?.value ? item.value : item.structured_formatting.main_text);
  };

  const handlePredictionSelect = (predictions: PlacePrediction[], i: number) => {
    setValue(predictions[i].structured_formatting.main_text);

    const updatedSelectList: SelectList = [
      { value: predictions[i].structured_formatting.main_text },
      ...predictions,
    ];

    setSelectList(updatedSelectList);
    setSelectedItem(predictions[i]);
    setSelectListShown(false);
  };

  const ClearPredictions = () => {
    setSelectListShown(false);
    setTimeout(() => {
      setSelectedItem({ value });
      setSelectList([{ value }]);
    }, 200);
  };

  const ref = useRef<any>(null);
  useEscapeOrOutsideClose(ref, () => {
    setSelectListShown(false);
  });
  const { selectedIndex, setSelectedIndex } = useArrowNavigation(
    selectList,
    itSelectListShown,
    handleIndexChange,
    setSelectListShown,
    handlePredictionSelect
  );

  return (
    <Combobox ref={ref} name="GooglePlaceAutocomplete">
      <ComboboxInput
        value={value}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        ariaExpanded={itSelectListShown}
        className={`bg-kolumbGray-50 fill-kolumbGray-400 text-kolumbGray-400 outline-0 ${
          itSelectListShown
            ? "shadow-sm duration-300 ease-kolumb-flow"
            : "rounded-b-[0.625rem] duration-200 ease-kolumb-leave"
        }`}
      >
        <button
          onClick={() => {
            setValue("");
            ClearPredictions();
          }}
          className="h-8 w-6 px-2 duration-100 hover:fill-kolumbGray-700"
        >
          <Icon.x className="w-2 " />
        </button>

        <div className="absolute left-6 top-2 h-4 border-r border-kolumbGray-200"></div>

        <button
          onClick={() => onAdd(selectedItem)}
          className="flex h-8 items-center justify-center gap-1 px-2 duration-100 hover:fill-kolumbGray-700 hover:text-kolumbGray-700"
        >
          <Icon.plus className="w-[10px]" />
          <p className="text-xs font-medium capitalize">add</p>
        </button>
      </ComboboxInput>

      <ComboboxList showList={itSelectListShown} length={selectList.length - 1}>
        {predictionsComponent(selectedIndex, selectList, prevSelectListLength, handlePredictionSelect)}
      </ComboboxList>
    </Combobox>
  );
}

// todo add flags countries
function predictionsComponent(
  selectedIndex: number,
  selectList: SelectList,
  prevSelectListLength: number,
  handleClick: (predictions: PlacePrediction[], i: number) => void
) {
  const predictions = selectList.slice(1) as PlacePrediction[];

  const Predictions = [];
  for (let i = 0; i < predictions.length; i++) {
    const key = i + predictions[i].place_id;
    const animationDelay = selectList.length !== prevSelectListLength ? "300ms" : "0";

    Predictions.push(
      <ComboboxOption
        key={key}
        onClick={() => {
          handleClick(predictions, i);
        }}
        isSelected={selectedIndex === i + 1}
        animationDelay={animationDelay}
      >
        <Icon.pin className="w-[0.625rem] flex-shrink-0" />

        <section className="flex h-9 w-[10.625rem] flex-col justify-center">
          <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm">
            {predictions[i].structured_formatting.main_text}
          </p>
          <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-kolumbGray-500">
            {predictions[i].structured_formatting.secondary_text}
          </p>
        </section>
      </ComboboxOption>
    );
  }
  return Predictions;
}
