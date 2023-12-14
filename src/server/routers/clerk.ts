import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { clerkClient } from "@clerk/nextjs";

const clerk = router({
  findUsername: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const userList = await clerkClient.users.getUserList({ username: [input] });
    return userList.map((user) => user.username);
  }),
});

export default clerk;
