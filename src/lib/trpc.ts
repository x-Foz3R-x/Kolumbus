import { toast } from "sonner";
import { showErrorToast } from "./handle-error";

export function mutationOpts(successMsg?: string) {
  return {
    onError: (error: unknown) => showErrorToast(error),
    ...(successMsg ? { onSuccess: () => toast.success(successMsg) } : {}),
  };
}
