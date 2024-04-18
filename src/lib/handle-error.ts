import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { toast } from "sonner";
import * as z from "zod";

import { unknownError } from "./constants";

export function getErrorMessage(error: unknown) {
  if (error instanceof z.ZodError) {
    const errors = error.issues.map((issue) => {
      return issue.message;
    });
    return errors.join("\n");
  } else if (error instanceof Error) {
    return error.message;
  } else if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.longMessage ?? unknownError;
  } else {
    return unknownError;
  }
}

export function showErrorToast(error: unknown) {
  const errorMessage = getErrorMessage(error);
  return toast.error(errorMessage);
}
