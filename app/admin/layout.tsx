import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true, email: true, image: true },
  });

  if (!user || user.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar user={user} />
      <main className="p-6 pt-20 lg:p-8">{children}</main>
    </div>
  );
}