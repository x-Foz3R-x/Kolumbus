import type { z } from "zod";
import type { currencySchema } from "~/server/db/schema";

export type Currency = z.infer<typeof currencySchema>;
