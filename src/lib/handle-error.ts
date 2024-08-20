import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { TRPCClientError } from "@trpc/client";
import { toast } from "sonner";
import * as z from "zod";

import { unknownError } from "./constants";

export function getErrorMessage(error: unknown) {
  if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.longMessage ?? error.errors[0]?.message ?? unknownError;
  }
  if (error instanceof TRPCClientError || error instanceof z.ZodError || error instanceof Error) {
    return error.message;
  }
  if (error instanceof Array && error.length > 0) return error.join(", ");
  if (typeof error === "string") return error;
  return unknownError;
}

export function showErrorToast(error: unknown) {
  console.error(error);
  const errorMessage = getErrorMessage(error);
  return toast.error(errorMessage);
}
