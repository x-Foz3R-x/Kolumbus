import { z } from "zod";

const MemberSchema = z.object({
  id: z.string(),
  username: z.string(),
  discriminator: z.string(),
  avatar: z.nullable(z.string()),
  status: z.string(),
  avatar_url: z.string(),
});

const DiscordServerResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  instant_invite: z.string(),
  channels: z.array(z.unknown()),
  members: z.array(MemberSchema),
  presence_count: z.number(),
});

export type DiscordServerResponse = z.infer<typeof DiscordServerResponseSchema>;
export { DiscordServerResponseSchema };
