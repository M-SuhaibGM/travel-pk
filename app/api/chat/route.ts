import { streamText, convertToModelMessages, UIMessage } from "ai";
import { prisma } from "@/lib/Prisma";
import { auth } from "@/lib/auth";
import { createGroq } from "@ai-sdk/groq";
import { generateEmbedding } from "@/lib/embeddings";



const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { messages, fileId }: { messages: UIMessage[]; fileId: string } = await req.json();

    const file = await prisma.file.findFirst({
        where: { id: fileId, userId: session.user.id },
    });

    if (!file) return new Response("Document not found", { status: 404 });

    // 1. Embed the user's latest question
    const lastMessage = messages[messages.length - 1];
    const questionText = lastMessage.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join(" ");

    const queryEmbedding = await generateEmbedding(questionText);
    const vectorString = `[${queryEmbedding.join(",")}]`;

    // Add this check before the vector search in route.ts
    const chunkCount = await prisma.documentChunk.count({ where: { fileId } });
    console.log("Chunks in DB for file:", chunkCount);

    if (chunkCount === 0) {
        return new Response("Document not processed yet. Please wait and try again.", { status: 400 });
    }
    // Replace the relevantChunks query with:
    // Replace the relevantChunks query with this:
    let relevantChunks: { content: string }[] = [];

    try {
        relevantChunks = await prisma.$queryRawUnsafe<{ content: string }[]>(
            `SELECT content
         FROM document_chunks
         WHERE file_id = $1
         ORDER BY embedding <=> $2::vector
         LIMIT 5`,
            fileId,
            `[${queryEmbedding.join(",")}]`
        );
    } catch (err) {
        console.error("Vector search failed:", err);
    }

    // Replace the fallback with a limited version:
    if (relevantChunks.length === 0) {
        console.log("Falling back to all chunks...");
        relevantChunks = await prisma.documentChunk.findMany({
            where: { fileId },
            select: { content: true },
            take: 3, // ← only take 3 chunks max
        });
    }
    console.log("Relevant chunks count:", relevantChunks.length);

    const rawContext = relevantChunks.map(c => c.content).join("\n\n---\n\n");
    const context = rawContext.slice(0, 4000); //
    console.log("Context for LLM:", context);

    // 3. Stream response with only relevant context
    const result = streamText({
        model: groq("llama-3.3-70b-versatile"),
        system: `You are a professional document assistant.
                 The user is asking questions about "${file.name}".
                 
                 Here are the most relevant sections from the document:
                 ---
                 ${context}
                 ---
                 
                 Answer based strictly on the content above. If the answer isn't in the context, say so.`,
        messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
}
