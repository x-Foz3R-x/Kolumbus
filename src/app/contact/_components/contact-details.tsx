"use client";

import { useEffect, useState } from "react";
import { Icons } from "~/components/ui";
import { siteConfig } from "~/config/site";

export default function ContactDetails({ children }: { children?: React.ReactNode }) {
  const email = "pawel@kolumbus.app";
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(() => setCopyState("idle"), 3500);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <section
      aria-labelledby="contact-heading"
      className="relative overflow-hidden px-2 pb-20 pt-14 bg-dot-gray-800/10 sm:px-8 sm:pt-20 lg:px-12"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-3xl">
          <p className="mb-5 font-inconsolata text-xs uppercase tracking-[0.2em] text-gray-400">
            A note to the creator
          </p>
          <h1
            id="contact-heading"
            className="font-belanosima text-4xl font-semibold leading-tight text-gray-700 sm:text-5xl"
          >
            Good conversations.
            <br />
            <span className="mt-2 inline-block -rotate-2 bg-yellow-300 px-3 pb-1 text-gray-800">
              New adventures.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-relaxed text-gray-500">
            Kolumbus is a personal take on making travel planning a little more playful. A question,
            a thought about the project, or just a hello — I’d love to hear it.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-[1.15fr_1fr]">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-kolumblue-500 p-6 sm:p-8">
            <p className="font-inconsolata text-xs uppercase tracking-[0.15em] text-gray-800">
              The direct route
            </p>
            <h2 className="mt-4 font-belanosima text-3xl font-semibold text-gray-800">
              Drop me a line.
            </h2>
            <a
              href={`mailto:${email}`}
              className="mt-4 inline-block max-w-full break-all font-inconsolata text-xl font-semibold text-gray-900 underline decoration-gray-800/30 underline-offset-4 sm:text-2xl"
            >
              {email}
            </a>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-kolumblue-50"
              >
                Send an email
                <Icons.arrowTopRight aria-hidden="true" className="size-3 fill-current" />
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-800/20 px-4 py-3 text-sm text-gray-800 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-800"
              >
                {copyState === "copied" ? (
                  <Icons.check aria-hidden="true" className="size-3 fill-current" />
                ) : (
                  <Icons.copy aria-hidden="true" className="size-3 fill-current" />
                )}
                {copyState === "copied" ? "Copied" : "Copy address"}
              </button>
            </div>
            <p role="status" className="mt-3 min-h-4 text-xs text-gray-800">
              {copyState === "copied"
                ? "Email address copied."
                : copyState === "error"
                  ? "Select the email address above to copy it."
                  : ""}
            </p>
          </div>
          <div className="flex flex-col rounded-[1.75rem] bg-gray-800 p-6 text-white sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <p className="font-inconsolata text-xs uppercase tracking-[0.15em] text-white/50">
                The scenic route
              </p>
              <Icons.discord aria-hidden="true" className="h-6 w-8 fill-kolumblue-300" />
            </div>
            <h2 className="mt-4 font-belanosima text-3xl font-semibold">Say hello on Discord.</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-300">
              For a more casual conversation about Kolumbus, travel ideas, or the little details
              that make an app fun to use.
            </p>
            <a
              href={siteConfig.links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex w-fit items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium hover:bg-white/20"
            >
              Open Discord
              <Icons.arrowTopRight aria-hidden="true" className="size-3 fill-current" />
            </a>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-fit text-xs text-gray-400 underline decoration-gray-600 underline-offset-4 hover:text-white"
            >
              Take a look at the source on GitHub ↗
            </a>
          </div>
        </div>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
