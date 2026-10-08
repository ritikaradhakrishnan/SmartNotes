import prisma from "@/lib/db/prisma";
import { createNoteSchema, updateNoteSchema, deleteNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";
const failure = (message: string, status: number) => Response.json({ error: message }, { status });

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return failure("Sign in to save notes.", 401);
  const input = createNoteSchema.safeParse(await req.json().catch(() => null));
  if (!input.success) return failure("Use a title up to 180 characters and content up to 50,000 characters.", 400);
  try {
    const note = await prisma.note.create({ data: { ...input.data, userId } });
    return Response.json({ note }, { status: 201 });
  } catch { return failure("Could not save to MongoDB. Check the database connection and try again.", 503); }
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return failure("Sign in to edit notes.", 401);
  const input = updateNoteSchema.safeParse(await req.json().catch(() => null));
  if (!input.success) return failure("Invalid note input.", 400);
  const { id, ...data } = input.data;
  try {
    // Ownership is part of the mutation, not a separate check that can become stale.
    const result = await prisma.note.updateMany({ where: { id, userId }, data });
    if (!result.count) return failure("Note not found.", 404);
    return Response.json({ ok: true });
  } catch { return failure("Could not update the note. Please try again.", 503); }
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return failure("Sign in to delete notes.", 401);
  const input = deleteNoteSchema.safeParse(await req.json().catch(() => null));
  if (!input.success) return failure("Invalid note ID.", 400);
  try {
    const result = await prisma.note.deleteMany({ where: { id: input.data.id, userId } });
    if (!result.count) return failure("Note not found.", 404);
    return Response.json({ ok: true });
  } catch { return failure("Could not delete the note. Please try again.", 503); }
}
