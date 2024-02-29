import { AnimatePresence, motion } from "framer-motion";
import { useDroppable } from "@dnd-kit/core";

import { EASING } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

import Icon from "../icons";
import Portal from "../portal";

export default function DndTrash() {
  const { active, isOver, setNodeRef } = useDroppable({ id: "trash", data: { type: "trash", dayIndex: -1 } });

  return (
    <Portal root="#trash-container" skipSSRCheck>
      <AnimatePresence>
        {active?.data.current?.type === "event" && (
          <div ref={setNodeRef}>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ ease: EASING.anticipate, duration: 0.4 }}
              className={cn(
                "mt-px flex h-9 w-16 cursor-pointer items-center justify-center rounded-md border border-red-200 bg-red-100 fill-red-500 duration-400 ease-kolumb-flow",
                isOver && "border-red-500 bg-red-500 fill-white shadow-md",
              )}
            >
              <Icon.trash className="h-3.5 flex-shrink-0" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
