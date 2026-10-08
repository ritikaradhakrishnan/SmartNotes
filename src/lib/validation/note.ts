import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(180),
  content: z.string().max(50000).optional(),
});
export type CreateNoteSchema = z.infer<typeof createNoteSchema>;
const id = z.string().regex(/^[a-f\d]{24}$/i, "Invalid note ID");
export const updateNoteSchema = createNoteSchema.extend({ id });
export const deleteNoteSchema = z.object({ id });
