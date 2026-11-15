"use client";
import { useState } from "react";
import { Note } from "@prisma/client";
import { UserButton } from "@clerk/nextjs";
import AddEditNoteDialog from "./AddEditNoteDialog";
import AboutSmartNotes from "./AboutSmartNotes";
import AIChatBox from "./AIChatBox";
import { Plus, Search, Sparkles, BookOpen } from "lucide-react";

export default function NotesWorkspace({notes}:{notes:Note[]}) {
 const [about,setAbout]=useState(false);
 const [query,setQuery]=useState("");const [open,setOpen]=useState(false);const [selected,setSelected]=useState<Note>();const [chat,setChat]=useState(false);
 const visible=notes.filter(n=>(n.title+' '+(n.content??'')).toLowerCase().includes(query.toLowerCase()));
 function edit(note?:Note){setSelected(note);setOpen(true)}
 function backup(){const url=URL.createObjectURL(new Blob([JSON.stringify({app:'SmartNotes',edition:'connected',notes},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='smartnotes-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 return <div className="min-h-screen bg-[#090909] text-white">
 <aside className="border-b border-[#303036] bg-[#101010] p-5 md:fixed md:inset-y-0 md:w-60 md:border-r md:p-7">
 <button type="button" aria-label="About SmartNotes" onClick={()=>setAbout(true)} className="flex items-center gap-2 text-2xl font-semibold tracking-tight"><BookOpen className="rounded-lg bg-white p-1 text-black" size={34}/>SmartNotes.</button>
 <p className="mt-8 hidden text-sm font-medium md:block">Your workspace</p><p className="mt-1 hidden text-xs text-[#b3b3bd] md:block">A home for your thoughts</p>
 <button onClick={()=>edit()} className="mt-6 flex w-full items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm text-black"><Plus size={18}/>New note</button>
 <p className="mb-3 mt-8 hidden md:block text-[10px] tracking-widest text-[#b3b3bd]">WORKSPACE</p><div className="hidden md:flex justify-between rounded-lg bg-[#242428] p-3 text-sm">All notes <span>{notes.length}</span></div>
 <button onClick={()=>setChat(true)} className="mt-3 hidden md:flex items-center gap-2 p-3 text-sm"><Sparkles size={17}/>Ask your notes</button>
 <div className="mt-8 hidden md:block rounded-lg border border-[#303036] p-4 md:absolute md:bottom-8 md:left-6 md:right-6"><p className="text-xs font-medium">● Saved to your account</p><p className="mt-2 text-xs leading-relaxed text-[#b3b3bd]">Your private notes are stored in MongoDB.</p><button onClick={backup} className="mt-3 text-xs underline">Export a backup ↗</button></div>
 </aside>
 <div className="md:ml-60"><header className="flex h-20 items-center justify-between border-b border-[#303036] px-6 md:px-12"><p className="text-xs text-[#b3b3bd]">Your workspace <span className="mx-3">/</span> All notes</p><UserButton afterSignOutUrl="/"/></header>
 <main className="mx-auto max-w-7xl px-6 py-10 md:px-12"><section className="flex items-center justify-between"><div><h1 className="mb-4 mt-5 font-mono text-2xl font-semibold font-semibold tracking-tight md:text-4xl">My notes</h1></div><span aria-hidden="true" className="hidden rotate-12 rounded border border-[#e8ddf5] bg-[#f2eafb] p-7 font-mono text-xl text-[#52525b] lg:block">ideas,<br/>in bloom. ✧</span></section>
 <section className="my-9 flex flex-wrap items-center gap-4 rounded-xl border border-[#303036] bg-[#161618] p-5"><Sparkles className="text-[#71628a]"/><div className="flex-1"><p className="mt-1 hidden text-xs text-[#b3b3bd] md:block">Ask your local assistant about your saved notes.</p></div><button onClick={()=>setChat(true)} className="rounded-lg border border-[#44444c] bg-white px-4 py-2 text-xs text-black">Ask your notes ↗</button></section>
 <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><h2 className="text-xl">All notes <span className="ml-2 text-xs text-[#b3b3bd]">{visible.length} notes</span></h2><label className="flex items-center gap-2 rounded-lg border border-[#303036] bg-[#161618] px-3"><Search size={16}/><input aria-label="Search your notes" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search your notes…" className="bg-transparent py-3 text-xs outline-none"/></label></div>
 <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{visible.map((note,i)=><button key={note.id} onClick={()=>edit(note)} style={{background:['#ffe58f','#cdb4ff','#ffb8d0','#a8d8ff','#ffc79e'][i%5]}} className="flex min-h-64 flex-col rounded-xl border border-[#303036] p-6 text-left text-[#18181b] transition-shadow hover:shadow-md"><span className="text-[10px] tracking-widest text-[#48434f]">MY NOTES</span><h3 className="my-5 break-words font-mono text-xl font-semibold">{note.title}</h3><p className="mb-5 line-clamp-4 whitespace-pre-line break-words text-sm leading-relaxed text-[#52525b]">{note.content}</p><span className="mt-auto border-t border-black/5 pt-3 text-xs text-[#48434f]">Edited {new Date(note.updatedAt).toISOString().slice(0,10)}</span></button>)}<button onClick={()=>edit()} className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#44444c] text-[#b3b3bd]"><Plus/><span>A fresh page</span><small>What’s on your mind?</small></button></div>{!visible.length&&query&&<p className="mt-5 text-sm">No matching notes. Try another word.</p>}
 <footer className="mt-10 border-t border-[#303036] py-5 text-xs text-[#b3b3bd]"><button onClick={backup} className="ml-4 underline md:hidden">Export backup</button></footer></main></div>
 <AboutSmartNotes open={about} onOpenChange={setAbout}/><AddEditNoteDialog key={selected?.id??'new'} open={open} setOpen={setOpen} noteToEdit={selected}/><AIChatBox open={chat} onClose={()=>setChat(false)}/></div>
}
