import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const KolumbusFileRouter = {
  tripImageUploader: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = auth();

      // validate user is logged in
      if (!user.userId) throw new UploadThingError("Unauthorized");

      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      // ! Whatever is returned here is sent to the client-side `onClientUploadComplete` callback
      return { imageUrl: file.url, uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type KolumbusFileRouter = typeof KolumbusFileRouter;
