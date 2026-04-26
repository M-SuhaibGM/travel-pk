import { auth } from "@/lib/auth";
import { prisma } from "@/lib/Prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { processDocument } from "@/lib/processDocument";


const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user?.id) throw new UploadThingError("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // 1. Create the file record in MySQL
      const createdFile = await prisma.file.create({
        data: {
          name: file.name,
          url: file.url,
          userId: metadata.userId,
          uploadStatus: "PROCESSING",
        },
      });

      // 2. Process in background using createdFile.id ← fix here
      processDocument(createdFile.id, file.url).catch(console.error);

      return { fileId: createdFile.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;