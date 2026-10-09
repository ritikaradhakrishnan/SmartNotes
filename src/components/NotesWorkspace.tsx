"use client";
import { useState } from "react";
import { Note } from "@prisma/client";
import { UserButton } from "@clerk/nextjs";
import AddEditNoteDialog from "./AddEditNoteDialog";
import AIChatBox from "./AIChatBox";
import { Plus, Search, Sparkles, BookOpen } from "lucide-react";

export default function NotesWorkspace({notes}:{notes:Note[]}) {
 const [query,setQuery]=useState("");const [open,setOpen]=useState(false);const [selected,setSelected]=useState<Note>();const [chat,setChat]=useState(false);
 const visible=notes.filter(n=>(n.title+' '+(n.content??'')).toLowerCase().includes(query.toLowerCase()));
 function edit(note?:Note){setSelected(note);setOpen(true)}
 function backup(){const url=URL.createObjectURL(new Blob([JSON.stringify({app:'SmartNotes',edition:'connected',notes},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='smartnotes-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 return <div className="min-h-screen bg-[#f8f7f3] text-[#2c3830]">
 <aside className="border-b border-[#dedfd5] bg-[#efefe8] p-5 md:fixed md:inset-y-0 md:w-60 md:border-r md:p-7">
 <a href="/notes" className="flex items-center gap-2 text-2xl font-semibold tracking-tight"><BookOpen className="rounded-lg bg-[#355847] p-1 text-white" size={34}/>SmartNotes.</a>
 <p className="mt-8 hidden text-sm font-medium md:block">Your workspace</p><p className="mt-1 hidden text-xs text-[#737d69] md:block">A home for your thoughts</p>
 <button onClick={()=>edit()} className="mt-6 flex w-full items-center gap-2 rounded-lg bg-[#355847] px-4 py-3 text-sm text-white"><Plus size={18}/>New note</button>
 <p className="mb-3 mt-8 hidden md:block text-[10px] tracking-widest text-[#737d69]">WORKSPACE</p><div className="hidden md:flex justify-between rounded-lg bg-[#e0e5d9] p-3 text-sm">All notes <span>{notes.length}</span></div>
 <button onClick={()=>setChat(true)} className="mt-3 hidden md:flex items-center gap-2 p-3 text-sm"><Sparkles size={17}/>Ask your notes</button>
 <div className="mt-8 hidden md:block rounded-lg border border-[#d9dece] p-4 md:absolute md:bottom-8 md:left-6 md:right-6"><p className="text-xs font-medium">● Saved to your account</p><p className="mt-2 text-xs leading-relaxed text-[#737d69]">Your private notes are stored in MongoDB.</p><button onClick={backup} className="mt-3 text-xs underline">Export a backup ↗</button></div>
 </aside>
 <div className="md:ml-60"><header className="flex h-20 items-center justify-between border-b border-[#e7e7df] px-6 md:px-12"><p className="text-xs text-[#737d69]">Your workspace <span className="mx-3">/</span> All notes</p><UserButton afterSignOutUrl="/"/></header>
 <main className="mx-auto max-w-7xl px-6 py-10 md:px-12"><section className="flex items-center justify-between"><div><p className="text-[10px] tracking-[.2em] text-[#737d69]">LESS SCATTER. MORE CLARITY.</p><h1 className="mb-4 mt-5 font-serif text-4xl tracking-tight md:text-5xl">A little space for <span className="text-[#7b8869]">big ideas.</span></h1><p className="text-sm text-[#737d69]">Capture a thought. Find a connection. Make something of it.</p></div><span aria-hidden="true" className="hidden rotate-12 rounded border border-[#e5dec4] bg-[#f9f4df] p-7 font-serif text-2xl italic text-[#7d8067] lg:block">ideas,<br/>in bloom. ✧</span></section>
 <section className="my-9 flex flex-wrap items-center gap-4 rounded-xl border border-[#dfe4d6] bg-[#eff2e7] p-5"><Sparkles className="text-[#73885c]"/><div className="flex-1"><h2 className="text-sm font-medium">Your next idea is already in here.</h2><p className="mt-1 hidden text-xs text-[#737d69] md:block">Ask your local assistant about your saved notes.</p></div><button onClick={()=>setChat(true)} className="rounded-lg border border-[#d4dbca] bg-[#f7f9f0] px-4 py-2 text-xs">Ask your notes ↗</button></section>
 <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><h2 className="text-xl">All notes <span className="ml-2 text-xs text-[#737d69]">{visible.length} notes</span></h2><label className="flex items-center gap-2 rounded-lg border border-[#e4e5dc] bg-white px-3"><Search size={16}/><input aria-label="Search your notes" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search your notes…" className="bg-transparent py-3 text-xs outline-none"/></label></div>
 <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{visible.map((note,i)=><button key={note.id} onClick={()=>edit(note)} style={{background:['#f5f0e1','#eaf0e5','#f5eae7','#eaf0f3','#f6f0d7'][i%5]}} className="flex min-h-64 flex-col rounded-xl border border-[#e0e2d6] p-6 text-left transition-shadow hover:shadow-md"><span className="text-[10px] tracking-widest text-[#737d69]">MY NOTES</span><h3 className="my-5 break-words font-serif text-2xl">{note.title}</h3><p className="mb-5 line-clamp-4 whitespace-pre-line break-words text-sm leading-relaxed text-[#68735d]">{note.content}</p><span className="mt-auto border-t border-black/5 pt-3 text-xs text-[#737d69]">Edited {new Date(note.updatedAt).toISOString().slice(0,10)}</span></button>)}<button onClick={()=>edit()} className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#d8dccd] text-[#737d69]"><Plus/><span>A fresh page</span><small>What’s on your mind?</small></button></div>{!visible.length&&query&&<p className="mt-5 text-sm">No matching notes. Try another word.</p>}
 <footer className="mt-10 border-t border-[#e7e7df] py-5 text-xs text-[#737d69]">Made for the way your mind works.<button onClick={backup} className="ml-4 underline md:hidden">Export backup</button></footer></main></div>
 <AddEditNoteDialog key={selected?.id??'new'} open={open} setOpen={setOpen} noteToEdit={selected}/><AIChatBox open={chat} onClose={()=>setChat(false)}/></div>
}
