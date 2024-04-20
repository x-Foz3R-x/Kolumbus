import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { toast } from "sonner";
import * as z from "zod";

import { unknownError } from "./constants";
import { TRPCClientError } from "@trpc/client";

export function getErrorMessage(error: unknown) {
  if (error instanceof TRPCClientError || error instanceof z.ZodError || error instanceof Error) {
    return error.message;
  }
  if (isClerkAPIResponseError(error)) return error.errors[0]?.longMessage ?? unknownError;
  if (error instanceof Array && error.length > 0) return error.join(", ");
  if (typeof error === "string") error;
  return unknownError;
}

export function showErrorToast(error: unknown) {
  const errorMessage = getErrorMessage(error);
  return toast.error(errorMessage);
}
