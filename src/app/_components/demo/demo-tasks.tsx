"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { Icons } from "~/components/ui";
import { countDemoActivities, demoChapters, demoTaskIds } from "./demo-activities";

export default function DemoTasks({ completed }: { completed: string[] }) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [expanded, setExpanded] = useState<string>(demoChapters[0].tasks[0].id);
  const [notice, setNotice] = useState("");
  const previousCompleted = useRef(completed);
  const chapter = demoChapters[chapterIndex] ?? demoChapters[0];
  const count = countDemoActivities(completed);

  function openChapter(index: number) {
    const next = demoChapters[index];
    if (!next) return;
    setChapterIndex(index);
    setExpanded(next.tasks.find((task) => !completed.includes(task.id))?.id ?? next.tasks[0].id);
    setNotice("");
  }

  useEffect(() => {
    const newlyCompleted = chapter.tasks.filter(
      (task) => completed.includes(task.id) && !previousCompleted.current.includes(task.id),
    );
    previousCompleted.current = completed;
    if (!newlyCompleted.length) return;

    const pending = chapter.tasks.find((task) => !completed.includes(task.id));
    const next = demoChapters[chapterIndex + 1];
    if (!pending && next) {
      setChapterIndex(chapterIndex + 1);
      setExpanded(next.tasks.find((task) => !completed.includes(task.id))?.id ?? next.tasks[0].id);
      setNotice(`${chapter.title} completed. Next: ${next.title}.`);
    } else if (!pending) {
      setExpanded("");
      setNotice("This chapter is complete. You can revisit the others whenever you like.");
    } else if (newlyCompleted.some((task) => task.id === expanded)) {
      setExpanded(pending.id);
    }
  }, [completed, chapter, chapterIndex, expanded]);

  return (
    <div className="p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 font-inconsolata text-xs text-gray-400">
            Chapter {chapterIndex + 1} of {demoChapters.length}
          </p>
          <h3 className="font-belanosima text-xl font-semibold text-gray-700">{chapter.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            Explore in any order. Nothing is locked.
          </p>
        </div>
        <span
          className="whitespace-nowrap rounded-full bg-kolumblue-50 px-2 py-1 text-xs font-medium text-kolumblue-600"
          aria-label={`${count} of ${demoTaskIds.length} activities explored`}
        >
          {count}/{demoTaskIds.length}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Demo activities"
        aria-valuemin={0}
        aria-valuemax={demoTaskIds.length}
        aria-valuenow={count}
        className="mb-4 h-1.5 overflow-hidden rounded-full bg-gray-100"
      >
        <div
          className="h-full rounded-full bg-kolumblue-400 transition-all duration-500"
          style={{ width: `${(count / demoTaskIds.length) * 100}%` }}
        />
      </div>
      <nav aria-label="Things to try chapters" className="mb-4 grid grid-cols-3 gap-1">
        {demoChapters.map((item, index) => {
          const done = item.tasks.filter((task) => completed.includes(task.id)).length;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => openChapter(index)}
              aria-current={chapterIndex === index ? "step" : undefined}
              aria-label={`${item.label} chapter: ${done} of ${item.tasks.length} activities explored`}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-lg border px-1 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-kolumblue-500",
                chapterIndex === index
                  ? "border-kolumblue-200 bg-kolumblue-50 text-kolumblue-700"
                  : "border-transparent text-gray-500 hover:bg-gray-50",
              )}
            >
              {item.label}
              <span className="font-inconsolata text-xs">
                {done === item.tasks.length ? (
                  <Icons.check aria-hidden="true" className="size-3 fill-emerald-600" />
                ) : (
                  `${done}/${item.tasks.length}`
                )}
              </span>
            </button>
          );
        })}
      </nav>
      <ul className="space-y-1">
        {chapter.tasks.map((task) => {
          const done = completed.includes(task.id);
          const open = expanded === task.id;
          return (
            <li key={task.id} className={cn("rounded-xl", open && "bg-gray-50")}>
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-xl px-2 py-3 text-left text-[13px] font-medium text-gray-600 focus-visible:ring-2 focus-visible:ring-kolumblue-300"
                onClick={() => setExpanded(open ? "" : task.id)}
                aria-expanded={open}
                aria-controls={`demo-task-${task.id}`}
              >
                <span
                  className={cn(
                    "flex size-5 flex-shrink-0 items-center justify-center rounded-full border border-gray-200",
                    done && "border-emerald-200 bg-emerald-50",
                  )}
                >
                  {done && <Icons.check aria-hidden="true" className="size-2.5 fill-emerald-600" />}
                </span>
                <span className={cn("flex-1", done && "text-gray-400")}>{task.title}</span>
                <Icons.chevron
                  aria-hidden="true"
                  className={cn("size-2 fill-gray-400 transition-transform", open && "rotate-180")}
                />
              </button>
              {open && (
                <p
                  id={`demo-task-${task.id}`}
                  className="px-3 pb-4 pl-10 text-[13px] leading-relaxed text-gray-500"
                >
                  {task.hint}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          aria-label="Previous chapter"
          disabled={chapterIndex === 0}
          onClick={() => openChapter(chapterIndex - 1)}
          className="rounded px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-kolumblue-500 disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          aria-label="Next chapter"
          disabled={chapterIndex === demoChapters.length - 1}
          onClick={() => openChapter(chapterIndex + 1)}
          className="rounded bg-kolumblue-50 px-3 py-1.5 text-xs text-kolumblue-700 hover:bg-kolumblue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-kolumblue-500 disabled:opacity-40"
        >
          Next chapter
        </button>
      </div>
      {(notice || count === demoTaskIds.length) && (
        <p
          role="status"
          className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-700"
        >
          {count === demoTaskIds.length
            ? "You’ve found your way around. Where will your next adventure take you?"
            : notice}
        </p>
      )}
    </div>
  );
}
