import useAppdata from "@/context/appdata";
import Icon from "../icons";
import { Event } from "@/types";

//#region Modal UI Props Interfaces
interface ModalProps {
  showModal: boolean;
  modalChildren: React.ReactNode;
}

interface ModalBodyProps {
  type: string;
  children: React.ReactNode;
}

interface ModalTextProps {
  children: React.ReactNode;
}

interface ListItem {
  [key: string]: any;
}

interface ModalGridListProps {
  list: ListItem[];
  sortBy: string;
  printField: string;
}

interface ModalButtonsProps {
  actionButtonText: string;
  actionButtonOnClick: Function;
}
//#endregion

export function Modal({ showModal, modalChildren }: ModalProps) {
  return (
    <div
      aria-labelledby="modal-title"
      aria-modal="true"
      role="dialog"
      className={`fixed inset-0 z-50 flex h-screen w-screen min-w-fit items-center justify-center p-10 duration-300 
        ${showModal ? "scale-100 ease-kolumb-overflow " : "scale-0 ease-kolumb-leave"}`}
    >
      <div
        className={`
          "relative max-w-lg overflow-hidden rounded-lg bg-white text-left shadow-xxxl duration-300 ease-kolumb-flow ${
            showModal ? "opacity-100 " : "opacity-0"
          }`}
      >
        {modalChildren}
      </div>
    </div>
  );
}

export function ModalBody({ type, children }: ModalBodyProps) {
  return (
    <div className="mt-3 flex gap-2 px-6 py-3">
      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-red-100 fill-red-500 p-2">
        {type === "exclamation" && <Icon.exclamationTriangle />}
      </div>
      <div className="ml-2 w-[calc(100%-3.5rem)]">{children}</div>
    </div>
  );
}

export function ModalTitle({ children }: ModalTextProps) {
  return <h1 className="mb-3 text-base font-semibold text-gray-800">{children}</h1>;
}

export function ModalMessage({ children }: ModalTextProps) {
  return <p className="my-2 text-sm font-normal text-gray-500">{children}</p>;
}

export function ModalGridList({ list, sortBy, printField }: ModalGridListProps) {
  const uniqueHeaders = Array.from(new Set(list.map((item) => item[sortBy])));

  const renderListItems = (header: any) => {
    return list
      .filter((item) => item[sortBy] === header)
      .map((item, index) => (
        <li
          key={`listItem${index}`}
          className="w-28 overflow-hidden text-ellipsis whitespace-nowrap rounded px-2 text-sm text-gray-500 [&:nth-child(odd)]:bg-gray-50"
        >
          {item[printField] ? <span>{item[printField]}</span> : <span>---</span>}
        </li>
      ));
  };

  return (
    <div className="flex gap-3 overflow-auto rounded-lg bg-gray-100 px-2 py-3">
      {uniqueHeaders.map((header, index) => (
        <div
          key={`header${index}`}
          className="h-full min-w-fit max-w-[8rem] rounded-md bg-white p-2 shadow-kolumblue"
        >
          <h2 className="mb-2 border-b border-gray-200 px-2 pb-1 text-center text-sm font-medium text-gray-600">
            {header}
          </h2>

          <ul className="max-h-28 overflow-auto">{renderListItems(header)}</ul>
        </div>
      ))}
    </div>
  );
}

export function ModalCancelActionButtons({ actionButtonText, actionButtonOnClick }: ModalButtonsProps) {
  const { setModalShown, isModalShown } = useAppdata();

  return (
    <section className="flex justify-end gap-3 bg-gray-50 px-5 py-3 text-sm font-medium">
      <button
        onClick={() => {
          setModalShown(false);
        }}
        className="rounded-lg bg-gray-100 px-5 py-[6px] capitalize text-gray-800 shadow-btn duration-200 ease-kolumb-overflow hover:scale-105"
      >
        Cancel
      </button>

      <button
        onClick={() => {
          if (isModalShown) actionButtonOnClick();
        }}
        className="rounded-lg bg-red-500 px-3 py-[6px] capitalize text-white shadow-btn duration-200 ease-kolumb-overflow hover:scale-105"
      >
        {actionButtonText}
      </button>
    </section>
  );
}

//#region Modal Presets
export function EventsOnExcludedDaysModal(
  eventsToDelete: Event[],
  handleExcludedDays: React.MouseEventHandler<HTMLButtonElement>
) {
  return (
    <>
      <ModalBody type="exclamation">
        <ModalTitle>Events Scheduled on Excluded Days</ModalTitle>

        <ModalMessage>The following events are scheduled on the day(s) you are about to remove:</ModalMessage>

        <ModalGridList list={eventsToDelete} sortBy="date" printField="display_name" />

        <ModalMessage>
          Are you sure you want to proceed and permanently delete the mentioned events?
        </ModalMessage>
      </ModalBody>
      <ModalCancelActionButtons actionButtonText="delete events" actionButtonOnClick={handleExcludedDays} />
    </>
  );
}
//#endregion
