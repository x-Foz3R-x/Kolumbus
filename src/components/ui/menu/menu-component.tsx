import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  type Alignment,
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  type Side,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from "@floating-ui/react";
import { cn } from "~/lib/utils";
import { TRANSITION } from "~/lib/motion";
import { MenuContext, useMenuContext } from "./menu-context";
import type { MenuProps } from "./types";

import { Button } from "../button";

export function MenuComponent({
  isOpen: controlledOpen,
  setIsOpen: setControlledOpen,
  placement = "right-start",
  offset: offsetOptions = 6,
  shift: shiftOptions = false,
  flip: flipOptions = { crossAxis: placement.includes("-"), padding: 6 },
  size: sizeOptions = {
    padding: 6,
    apply({ elements, availableHeight, availableWidth }) {
      Object.assign(elements.floating.style, {
        maxWidth: `${availableWidth}px`,
        maxHeight: `${availableHeight}px`,
      });
      if (elements.floating.firstElementChild instanceof HTMLElement) {
        Object.assign(elements.floating.firstElementChild.style, {
          maxWidth: `${availableWidth}px`,
          maxHeight: `${availableHeight}px`,
        });
      }
    },
  },
  loop,
  animation,
  zIndex,
  className,
  rootSelector,
  darkMode,
  buttonProps,
  children,
}: MenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  //#region Floating UI
  const parent = useMenuContext();
  const elementsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const item = useListItem();

  const isNested = parentId != null;

  const { floatingStyles, refs, context } = useFloating<HTMLButtonElement>({
    nodeId,
    placement,
    open: open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      ...(offsetOptions ? [offset(offsetOptions)] : []),
      ...(shiftOptions ? [shift(shiftOptions)] : []),
      ...(flipOptions ? [flip(flipOptions)] : []),
      ...(sizeOptions ? [size(sizeOptions)] : []),
    ],
  });

  const hover = useHover(context, {
    enabled: isNested,
    delay: { open: 75 },
    handleClose: safePolygon({ blockPointerEvents: true }),
  });
  const click = useClick(context, {
    event: "mousedown",
    toggle: !isNested,
    ignoreMouse: isNested,
  });
  const role = useRole(context, { role: "menu" });
  const dismiss = useDismiss(context, { bubbles: true });
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    nested: isNested,
    onNavigate: setActiveIndex,
    loop,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: open ? setActiveIndex : undefined,
  });

  // Event emitter allows you to communicate across tree components.
  // This effect closes all menus when an item gets clicked anywhere
  // in the tree.
  useEffect(() => {
    if (!tree) return;

    function handleTreeClick() {
      setOpen(false);
    }

    function onSubMenuOpen(event: { nodeId: string; parentId: string }) {
      if (event.nodeId !== nodeId && event.parentId === parentId) {
        setOpen(false);
      }
    }

    tree.events.on("click", handleTreeClick);
    tree.events.on("menuopen", onSubMenuOpen);

    return () => {
      tree.events.off("click", handleTreeClick);
      tree.events.off("menuopen", onSubMenuOpen);
    };
  }, [setOpen, tree, nodeId, parentId]);

  useEffect(() => {
    if (open && tree) {
      tree.events.emit("menuopen", { parentId, nodeId });
    }
  }, [tree, open, nodeId, parentId]);

  const ref = useMergeRefs([refs.setReference, item.ref]);
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    hover,
    click,
    role,
    dismiss,
    listNavigation,
    typeahead,
  ]);
  //#endregion

  const origin = useMemo(() => {
    const [side, alignment] = context.placement.split("-") as [Side, Alignment];
    const axis = ["top", "bottom"].includes(side) ? "y" : "x";

    const oppositeSideMap = {
      top: "bottom" as Side,
      right: "left" as Side,
      bottom: "top" as Side,
      left: "right" as Side,
    };

    let transformOrigin: string = oppositeSideMap[side];
    if (alignment === "start")
      transformOrigin = axis === "y" ? `${transformOrigin} left` : `top ${transformOrigin}`;
    else if (alignment === "end")
      transformOrigin = axis === "y" ? `${transformOrigin} right` : `bottom ${transformOrigin}`;

    return transformOrigin;
  }, [context.placement]);
  const variants = useMemo(() => {
    if (animation === null) return undefined;
    if (animation === "fadeToPosition")
      return TRANSITION.fadeToPosition[placement.split("-")[0] as Side];
    if (animation) return TRANSITION[animation];

    return TRANSITION.fadeInScale;
  }, [animation, placement]);
  const tooltipProps = useMemo(() => {
    return open
      ? undefined
      : rootSelector && buttonProps?.tooltip
        ? { ...buttonProps.tooltip, rootSelector }
        : buttonProps?.tooltip;
  }, [open, rootSelector, buttonProps]);
  const ButtonComponent = useMemo(
    () => (
      <Button
        ref={ref}
        tabIndex={!isNested ? undefined : parent?.activeIndex === item.index ? 0 : -1}
        role={isNested ? "menuitem" : undefined}
        {...getReferenceProps()}
        {...buttonProps}
        tooltip={tooltipProps}
      />
    ),
    [ref, isNested, parent, item, tooltipProps, buttonProps, getReferenceProps],
  );

  const menuContext = useMemo(
    () => ({
      isOpen: open,
      activeIndex,
      setActiveIndex,
      getItemProps,
    }),
    [open, activeIndex, setActiveIndex, getItemProps],
  );

  // Set isMounted to true when open becomes true
  useEffect(() => {
    open && setIsMounted(true);
  }, [open]);

  return (
    <FloatingNode id={nodeId}>
      {ButtonComponent}

      <MenuContext.Provider value={menuContext}>
        {isMounted && (
          <FloatingPortal
            root={
              rootSelector
                ? (document.querySelector(rootSelector) as HTMLElement | undefined)
                : undefined
            }
          >
            <FloatingFocusManager
              context={context}
              modal={false}
              initialFocus={isNested ? -1 : 0}
              returnFocus={!isNested}
            >
              <div
                ref={refs.setFloating}
                style={{ ...floatingStyles, zIndex }}
                className={cn(darkMode && "dark")}
                {...getFloatingProps()}
              >
                <AnimatePresence onExitComplete={() => setIsMounted(false)}>
                  {open && (
                    <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
                      <motion.ul
                        style={{ transformOrigin: origin }}
                        className={cn(
                          "flex flex-col overflow-auto rounded-xl border bg-white p-1.5 font-inter shadow-floating dark:border-gray-700 dark:bg-gray-900 dark:text-white",
                          className,
                        )}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={variants}
                      >
                        {children}
                      </motion.ul>
                    </FloatingList>
                  )}
                </AnimatePresence>
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </MenuContext.Provider>
    </FloatingNode>
  );
}
