import { memo, useMemo, useState } from "react";
import { FloatingDelayGroup } from "@floating-ui/react";

import { cn, os } from "~/lib/utils";
import type { PlaceSchema } from "~/lib/types";

import { Button, Divider, Icons } from "~/components/ui";
import { Menu, MenuLink, MenuOption } from "~/components/ui/menu";
import { constructGoogleMapsUrl, constructGoogleUrl } from "~/lib/constructors";

type Props = {
  place: PlaceSchema;
  isMenuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpen: () => void;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  disable: boolean;
};
export const PlaceUiOverlay = memo(function ActivityOverlay({
  place,
  isMenuOpen,
  setMenuOpen,
  onOpen: handleOpen,
  onSelect: handleSelect,
  onDuplicate: handleDuplicate,
  onDelete: handleDelete,
  disable,
}: Props) {
  const googleUrl = useMemo(
    () => constructGoogleUrl(place.name, place.address),
    [place.name, place.address],
  );
  const googleMapsUrl = useMemo(
    () => constructGoogleMapsUrl(place.id, place.name, place.address),
    [place.id, place.name, place.address],
  );

  if (disable) return null;

  return (
    <div
      className={cn(
        "place-ui-overlay absolute right-1 top-1 z-20 flex h-7 w-24 overflow-hidden rounded bg-white opacity-0 shadow-lg duration-300 ease-kolumb-out focus-within:opacity-100 focus-within:ease-kolumb-flow group-hover/event:opacity-100 group-hover/event:ease-kolumb-flow",
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
          <Icons.select className="pointer-events-none m-auto h-3.5 scale-100" />
        </Button>

        {/* Details */}
        <Button
          onClick={handleOpen}
          variant="unset"
          size="unset"
          className="ignore-deselect w-full fill-gray-500 duration-200 ease-kolumb-flow hover:bg-gray-100 hover:fill-gray-700 focus-visible:bg-kolumblue-100"
          tooltip={{ zIndex: 30, offset: 4, children: "Details" }}
        >
          <Icons.details className="pointer-events-none m-auto h-3 scale-100" />
        </Button>

        {/* Options */}
        <Menu
          isOpen={isMenuOpen}
          setIsOpen={setMenuOpen}
          offset={{ mainAxis: 10, crossAxis: -6 }}
          zIndex={30}
          className="place-ui-overlay ignore-deselect w-60 min-w-fit"
          buttonProps={{
            variant: "unset",
            size: "unset",
            className:
              "h-full w-full rounded-none fill-gray-500 duration-200 ease-kolumb-flow hover:bg-gray-100 hover:fill-gray-700 focus-visible:bg-kolumblue-100",
            tooltip: { zIndex: 30, offset: 4, children: "Options" },
            children: (
              <Icons.horizontalDots className="pointer-events-none m-auto h-2 w-4 scale-100" />
            ),
          }}
        >
          {/* Open in third party website */}
          {(!!googleUrl || !!googleMapsUrl) && (
            <>
              <p className="p-1.5 text-xs font-semibold text-gray-500">Open in</p>

              <div className="flex items-center gap-1.5">
                <MenuLink
                  label="Google"
                  href={googleUrl}
                  target="_blank"
                  classNames={{ button: "before:content-none" }}
                  className="flex gap-3.5 rounded-lg border font-normal shadow-sm duration-300 ease-kolumb-flow group-focus:translate-x-0 group-focus:bg-gray-100"
                >
                  <Icons.google className="h-3.5 w-3.5" />
                  <Icons.googleLogo className="mt-[3px] h-3.5 fill-gray-600" />
                </MenuLink>

                <MenuLink
                  label="Google Maps"
                  href={googleMapsUrl}
                  target="_blank"
                  classNames={{ button: "before:content-none" }}
                  className="flex gap-3.5 whitespace-nowrap rounded-lg border font-normal shadow-sm duration-300 ease-kolumb-flow group-focus:translate-x-0 group-focus:bg-gray-100"
                >
                  <Icons.googleMaps className="h-3.5 w-3.5" />
                  <Icons.googleMapsLogo className="mt-[3px] h-3.5 fill-gray-600" />
                </MenuLink>
              </div>

              <Divider className="mb-1.5 mt-2 bg-gray-100" />
            </>
          )}

          <MenuOption
            label="Select"
            shortcut={os() === "macos" ? "⌘+Click" : "Ctrl+Click"}
            onClick={handleSelect}
          >
            <Icons.select className="h-4 w-4" />
            Select
          </MenuOption>
          <MenuOption
            label="Details"
            shortcut="Click"
            onClick={handleOpen}
            className="text-[13px] font-medium"
          >
            <Icons.details className="h-4 w-4" />
            Details
          </MenuOption>
          <MenuOption
            label="Copy Address"
            onClick={() => place.address && navigator.clipboard.writeText(place.address)}
            className="text-[13px] font-medium"
          >
            <Icons.clipboardPin className="h-4 w-4" />
            Copy Address
          </MenuOption>
          <MenuOption label="Duplicate" onClick={handleDuplicate}>
            <Icons.duplicate className="h-4 w-4" />
            Duplicate
          </MenuOption>
          <MenuOption label="Delete" onClick={handleDelete} variant="danger">
            <Icons.trash className="h-4 w-4" />
            Delete
          </MenuOption>
        </Menu>
      </FloatingDelayGroup>
    </div>
  );
});
