import { memo, useState } from "react";
import { FloatingDelayGroup } from "@floating-ui/react";

import { cn, os } from "~/lib/utils";
import { Event } from "~/types";

import { Button, Divider, Icon } from "~/components/ui";
import { Menu, MenuLink, MenuOption } from "~/components/ui/menu";

type ActivityOverlayProps = {
  activity: Event;
  disable: boolean;
  onOpen: () => void;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};
export const ActivityUIOverlay = memo(function ActivityOverlay({
  activity,
  disable,
  onOpen: handleOpen,
  onSelect: handleSelect,
  onDuplicate: handleDuplicate,
  onDelete: handleDelete,
}: ActivityOverlayProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  if (disable) return null;

  return (
    <div
      className={cn(
        "absolute right-1 top-1 z-20 flex h-7 w-24 overflow-hidden rounded bg-white opacity-0 shadow-lg duration-300 ease-kolumb-out focus-within:opacity-100 focus-within:ease-kolumb-flow group-hover/event:opacity-100 group-hover/event:ease-kolumb-flow",
        isMenuOpen && "opacity-100",
      )}
    >
      <FloatingDelayGroup delay={{ open: 600 }} timeoutMs={300}>
        {/* Select */}
        <Button
          onClick={handleSelect}
          variant="unset"
          size="unset"
          className="ignore-deselect w-full fill-gray-500 duration-200 ease-kolumb-flow hover:bg-gray-100 hover:fill-gray-700 focus-visible:bg-kolumblue-100"
          tooltip={{ zIndex: 30, offset: 4, children: "Select" }}
        >
          <Icon.select className="pointer-events-none m-auto h-3.5 scale-100" />
        </Button>

        {/* Details */}
        <Button
          onClick={handleOpen}
          variant="unset"
          size="unset"
          className="w-full fill-gray-500 duration-200 ease-kolumb-flow hover:bg-gray-100 hover:fill-gray-700 focus-visible:bg-kolumblue-100"
          tooltip={{ zIndex: 30, offset: 4, children: "Details" }}
        >
          <Icon.details className="pointer-events-none m-auto h-3 scale-100" />
        </Button>

        {/* Options */}
        <Menu
          isOpen={isMenuOpen}
          setIsOpen={setMenuOpen}
          offset={{ mainAxis: 10, crossAxis: -6 }}
          zIndex={30}
          className="w-56"
          buttonProps={{
            variant: "unset",
            size: "unset",
            className:
              "ignore-deselect h-full w-full rounded-none fill-gray-500 duration-200 ease-kolumb-flow hover:bg-gray-100 hover:fill-gray-700 focus-visible:bg-kolumblue-100",
            tooltip: { zIndex: 30, offset: 4, children: "Options" },
            children: (
              <Icon.horizontalDots className="pointer-events-none m-auto h-2 w-4 scale-100" />
            ),
          }}
        >
          <MenuOption label="Details" onClick={handleOpen}>
            <Icon.details className="h-4 w-4" />
            Details
            <span className="ml-auto text-xs text-gray-400">Click</span>
          </MenuOption>
          <MenuOption
            label="Copy Address"
            onClick={() => activity.address && navigator.clipboard.writeText(activity.address)}
          >
            <Icon.clipboardPin className="h-4 w-4" />
            Copy Address
          </MenuOption>

          <MenuLink label="Google Maps" href={activity.url} target="_blank">
            <Icon.googleMapsIcon className="h-4 w-4" />
            <span>
              <Icon.googleMapsText className="fill-gray-650 mr-1 inline h-[14.5px] w-20" />
              <Icon.arrowTopRight className="mb-2 inline h-1.5" />
            </span>
          </MenuLink>

          <Divider className="my-1.5 bg-gray-100" />

          <MenuOption label="Select" onClick={handleSelect} className="ignore-deselect">
            <Icon.select className="h-4 w-4" />
            Select
            <span className="ml-auto text-xs text-gray-400">
              {os() === "macos" ? "⌘" : "Ctrl"}+Click
            </span>
          </MenuOption>
          <MenuOption label="Duplicate" onClick={handleDuplicate}>
            <Icon.duplicate className="h-4 w-4" />
            Duplicate
          </MenuOption>
          <MenuOption label="Delete" onClick={handleDelete} variant="danger">
            <Icon.trash className="h-4 w-4" />
            Delete
          </MenuOption>
        </Menu>
      </FloatingDelayGroup>
    </div>
  );
});
