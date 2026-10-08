import { z } from "zod";

export const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(4000),
  })).min(1).max(12).refine(messages => messages.at(-1)?.role === "user", "End with a question"),
});

type SearchNote = { id: string; title: string; content: string | null };
const stopWords = new Set("a an the is are was were i my me you your we our it this that these those what which how why when where do does did can could would should about of to in on for and or with please notes note tell".split(" "));
export function relevantNotes<T extends SearchNote>(notes: T[], question: string): T[] {
  const terms = Array.from(new Set(question.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [])).filter(term => !stopWords.has(term));
  const ranked = notes.map(note => {
    const title = note.title.toLocaleLowerCase();
    const body = (note.content ?? "").toLocaleLowerCase();
    return { note, score: terms.reduce((sum, term) => sum + (title.includes(term) ? 3 : 0) + (body.includes(term) ? 1 : 0), 0) };
  }).sort((a,b) => b.score - a.score);
  const matches = ranked.filter(n => n.score > 0);
  // General questions use recent notes. The caller supplies only this user's notes.
  return (matches.length ? matches : ranked).slice(0, 5).map(n => n.note);
}
export function noteContext(notes: SearchNote[]) {
  return notes.map((n,i) => `[${i+1}] ${n.title}\n${(n.content ?? "").slice(0, 3000)}`).join("\n\n");
}
