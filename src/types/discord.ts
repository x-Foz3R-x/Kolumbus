import { z } from "zod";

export type DiscordServerResponse = z.infer<typeof DiscordServerResponseSchema>;
export const DiscordServerResponseSchema = z
  .object({
    approximate_member_count: z.number(),
    approximate_presence_count: z.number(),
  })
  .optional();
