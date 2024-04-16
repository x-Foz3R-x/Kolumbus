import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { KolumbusFileRouter } from "~/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<KolumbusFileRouter>();
export const UploadDropzone = generateUploadDropzone<KolumbusFileRouter>();

export const { useUploadThing } = generateReactHelpers<KolumbusFileRouter>();
