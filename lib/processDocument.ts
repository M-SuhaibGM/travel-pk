import { extractText, getDocumentProxy } from "unpdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { generateEmbeddings } from "./embeddings";
import { prisma } from "./Prisma";

export async function processDocument(fileId: string, fileUrl: string) {
    try {
        console.log("Starting processDocument for fileId:", fileId);

        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));
        const { text } = await extractText(pdf, { mergePages: true });

        console.log("Extracted text length:", text.length);
        console.log("Sample text:", text.slice(0, 200));

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const chunks = await splitter.splitText(text);
        console.log("Total chunks:", chunks.length);

        const embeddings = await generateEmbeddings(chunks);
        console.log("Generated embeddings:", embeddings.length);

        await prisma.documentChunk.deleteMany({ where: { fileId } });

        for (let i = 0; i < chunks.length; i++) {
            const vectorString = `[${embeddings[i].join(",")}]`;
            console.log(`Inserting chunk ${i}, vector starts with:`, vectorString.slice(0, 30));

            await prisma.$executeRawUnsafe(
                `INSERT INTO document_chunks (id, content, file_id, embedding)
         VALUES ($1::text, $2::text, $3::text, $4::vector)`,
                crypto.randomUUID(),
                chunks[i],
                fileId,
                vectorString
            );
        }

        const storedCount = await prisma.documentChunk.count({ where: { fileId } });
        console.log("All chunks stored successfully. Count:", storedCount);

        await prisma.file.update({
            where: { id: fileId },
            data: { uploadStatus: "COMPLETED" },
        });

    } catch (error) {
        console.error("processDocument failed:", error);

        await prisma.file.update({
            where: { id: fileId },
            data: { uploadStatus: "FAILED" },
        }).catch(console.error);
    }
}