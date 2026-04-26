"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MessageSquare, Trash2, ExternalLink,FileText } from "lucide-react";
import Link from "next/link";

export function FileTable({ data }: { data: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((file) => (
          <TableRow key={file.id}>
            <TableCell className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              {file.name}
            </TableCell>
            <TableCell>
              <Badge variant={file.uploadStatus === "COMPLETED" ? "default" : "secondary"}>
                {file.uploadStatus}
              </Badge>
            </TableCell>
            <TableCell>{format(new Date(file.createdAt), "MMM d, yyyy")}</TableCell>
            <TableCell className="text-right flex justify-end gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/chat/${file.id}`}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}