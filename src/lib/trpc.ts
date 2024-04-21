import { toast } from "sonner";
import { showErrorToast } from "./handle-error";
import { TRPCError } from "@trpc/server";

export function toastHandler(successMsg?: string) {
  return {
    onError: (error: unknown) => showErrorToast(error),
    ...(successMsg ? { onSuccess: () => toast.success(successMsg) } : {}),
  };
}

export const error = {
  badRequest: (message: string) => new TRPCError({ code: "BAD_REQUEST", message }),
  internalServerError: (message: string) =>
    new TRPCError({ code: "INTERNAL_SERVER_ERROR", message }),
  unauthorized: (message: string) => new TRPCError({ code: "BAD_REQUEST", message }),
};
