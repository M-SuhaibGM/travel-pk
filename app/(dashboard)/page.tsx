
import { prisma } from "@/lib/Prisma";
import { redirect } from "next/navigation";
import { FileUploader } from "../components/file-upload";
import { FileTable } from "../components/file-table";
import {
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";


export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        return redirect("/auth");

    }

    // Fetch user's files from MySQL
    const files = await prisma.file.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="flex flex-col gap-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
                    <p className="text-muted-foreground">
                        Upload and manage your PDFs for AI analysis.
                    </p>
                </div>
                <FileUploader />
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{files.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Processed</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {files.filter((f: typeof files[0]) => f.uploadStatus === "COMPLETED").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Standard Plan</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content: File Table */}
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Recent Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                    {files.length > 0 ? (
                        <FileTable data={files} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No documents found</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                You haven&apos;t uploaded any documents yet. Use the button above to get started.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}