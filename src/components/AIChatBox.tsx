"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Bot, Trash, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string; sources?: {id: string; title: string}[] };
export default function AIChatBox({ open, onClose }: {open: boolean; onClose: () => void}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scroll = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeRequest = useRef<AbortController | null>(null);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => { scroll.current?.scrollTo(0, scroll.current.scrollHeight); }, [messages, loading]);
  useEffect(() => () => activeRequest.current?.abort(), []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || !input.trim()) return;
    const question = input.trim();
    const next: Message[] = [...messages, {role: "user", content: question}];
    setLoading(true); setError(""); setMessages(next); setInput("");
    const controller = new AbortController(); activeRequest.current = controller;
    try {
      const response = await fetch("/api/chat", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({messages: next.slice(-6).map(({role,content}) => ({role,content}))}), signal: controller.signal});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not answer. Try again.");
      setMessages([...next, {role: "assistant", content: result.content, sources: result.sources}]);
    } catch (err) {
      if (!controller.signal.aborted) { setMessages(messages); setInput(question); setError(err instanceof Error ? err.message : "Could not answer. Try again."); }
    } finally { setLoading(false); activeRequest.current = null; }
  }
  if (!open) return null;
  return <section aria-label="Chat with your notes" className="fixed bottom-3 right-3 z-20 flex h-[min(600px,90vh)] w-[calc(100%-24px)] max-w-lg flex-col rounded-xl border bg-background text-foreground shadow-xl">
    <header className="flex items-center gap-2 border-b p-4"><Bot/><div className="flex-1"><h2 className="font-semibold">Ask your notes</h2><p className="text-xs text-muted-foreground">Local Ollama · selected recent notes · answers can be imperfect</p></div><Button variant="ghost" size="icon" aria-label="Close chat" onClick={onClose}><X/></Button></header>
    <div ref={scroll} className="flex-1 overflow-y-auto p-4" aria-live="polite">
      {!messages.length && <p className="py-12 text-center text-sm text-muted-foreground">Ask about an idea, a plan, or a detail in your saved notes.</p>}
      {messages.map((message,i) => <div key={i} className={`mb-4 rounded-lg p-3 ${message.role === "user" ? "ml-8 bg-primary text-primary-foreground" : "mr-4 bg-muted"}`}><p className="mb-1 text-xs font-semibold">{message.role === "user" ? "You" : "SmartNotes"}</p><p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>{!!message.sources?.length && <div className="mt-3 border-t pt-2 text-xs"><p>Notes provided to the model:</p>{message.sources.map((s,j) => <p key={s.id}>[{j+1}] {s.title}</p>)}</div>}</div>)}
      {loading && <p className="text-sm text-muted-foreground">Your Mac is thinking… The first answer may take a moment.</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
    <form onSubmit={submit} className="flex gap-2 border-t p-3"><Button type="button" variant="outline" size="icon" disabled={loading} aria-label="Clear chat" onClick={() => {setMessages([]); setError("");}}><Trash size={18}/></Button><Input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} maxLength={4000} placeholder="Ask about your notes…" aria-label="Question about your notes" disabled={loading}/><Button disabled={loading || !input.trim()}>Send</Button></form>
  </section>;
}
