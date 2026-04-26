import ChatInterface from "@/app/components/ChatInterface";
import { prisma } from "@/lib/Prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

interface PageProps {
    params: Promise<{
        fileId: string;
    }>;
}

export default async function ChatPage({ params }: PageProps) {
    const session = await auth();
    const { fileId } = await params;

    // 1. Guard: If not logged in, go to auth
    if (!session?.user) {
        redirect("/auth");
    }

    // 2. Fetch file from MariaDB
    const file = await prisma.file.findFirst({
        where: {
            id: fileId,
            userId: session.user.id, // Security: Only allow the owner to see it
        },
    });

    // 3. Guard: If file doesn't exist or belongs to someone else
    if (!file) {
        notFound();
    }

    return (
        <div className="flex flex-col h-[80vh]">
            <div className="p-4 border-b bg-white">
                <h1 className="text-xl font-bold">Chatting with: {file.name}</h1>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Side: PDF Viewer */}
                <div className="w-1/2 border-r bg-slate-50">
                    <iframe
                        src={file.url}
                        className="w-full h-full"
                        title="PDF Viewer"
                    />
                </div>

                {/* Right Side: AI Chat Interface */}
                <div className="w-full md:w-1/2 flex flex-col relative bg-white">
                    <ChatInterface fileId={fileId} />
                </div>
            </div>
        </div>
    );
}