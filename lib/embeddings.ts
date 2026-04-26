import { embed, embedMany } from "ai";
import { cohere } from "@ai-sdk/cohere";

const embeddingModel = cohere.embedding("embed-v4.0");

export async function generateEmbeddings(chunks: string[]): Promise<number[][]> {
    const { embeddings } = await embedMany({
        model: embeddingModel,
        values: chunks,
    });
    return embeddings;
}

export async function generateEmbedding(text: string): Promise<number[]> {
    const { embedding } = await embed({
        model: embeddingModel,
        value: text,
    });
    return embedding;
}