"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { FilePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
export const FileUploader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    return (
        <Dialog open={isOpen} onOpenChange={(v) => {
            if (!v) setIsOpen(v);
        }}>
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button className="gap-2 font-sans cursor-pointer">
                    <FilePlus className="h-4 w-4 " />
                    Upload PDF
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center mb-4">
                        Upload your Documentation
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center p-4">
                    <UploadDropzone
                        endpoint="pdfUploader"
                        onUploadBegin={() => setIsUploading(true)}
                        onClientUploadComplete={(res) => {
                            setIsUploading(false);
                            setIsOpen(false);

                            toast.success("uploaded successfully! Processing may take a moment.");

                            // Refresh the dashboard to show the new file
                            router.refresh();

                            // Optionally redirect straight to the new chat
                            if (res?.[0]) {
                                router.push(`/dashboard/chat/${res[0].serverData.fileId}`);
                            }
                        }}
                        onUploadError={(error: Error) => {
                            setIsUploading(false);
                            console.error("Upload error:", error);
                            toast.error("Error Uploading file");
                        }}
                        appearance={{
                            container: "w-full border-2 border-dashed border-slate-200 p-10 hover:bg-slate-50 transition",
                            label: "text-primary hover:text-primary/80",
                            button: "bg-primary text-white ut-uploading:cursor-not-allowed",
                        }}
                    />

                    {isUploading && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing and Embedding...
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};