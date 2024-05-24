import { z } from "zod";

export type DiscordServerResponseSchema = z.infer<typeof discordServerResponseSchema>;
export const discordServerResponseSchema = z
  .object({
    approximate_member_count: z.number(),
    approximate_presence_count: z.number(),
  })
  .optional();
