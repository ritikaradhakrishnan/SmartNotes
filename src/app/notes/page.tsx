import NotesWorkspace from "@/components/NotesWorkspace";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "SmartNotes - Notes",
};

export default async function NotesPage() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const allNotes = await prisma.note.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });

  return <NotesWorkspace notes={allNotes} />;
}
