export const STORAGE_KEY = 'smartnotes.browser.v1';
export const NOTEBOOKS = ['Personal', 'Work', 'Learning'];
export const COLORS = ['cream', 'green', 'pink', 'blue', 'yellow'];
export function validateNotes(value) {
  if (!Array.isArray(value) || value.length > 5000) throw new Error('Choose a SmartNotes backup with up to 5,000 notes.');
  const ids = new Set();
  return value.map(n => {
    if (!n || typeof n.id !== 'string' || !n.id || n.id.length > 100 || ids.has(n.id) || typeof n.title !== 'string' || !n.title.trim() || n.title.length > 180 || typeof n.content !== 'string' || n.content.length > 100000 || !NOTEBOOKS.includes(n.notebook) || !COLORS.includes(n.color) || !Array.isArray(n.tags) || n.tags.length > 10 || n.tags.some(t => typeof t !== 'string' || t.length > 30) || typeof n.pinned !== 'boolean' || typeof n.archived !== 'boolean' || !Number.isFinite(Date.parse(n.createdAt)) || !Number.isFinite(Date.parse(n.updatedAt))) throw new Error('This file is not a valid SmartNotes backup.');
    ids.add(n.id);
    return {id:n.id,title:n.title,content:n.content,notebook:n.notebook,color:n.color,tags:[...new Set(n.tags)],pinned:n.pinned,archived:n.archived,createdAt:n.createdAt,updatedAt:n.updatedAt};
  });
}
export function filterNotes(notes, {view='all',query='',tag='',sort='updated'}={}) {
  const terms=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return notes.filter(n => (view==='archived' ? n.archived : !n.archived) && (view==='pinned' ? n.pinned : NOTEBOOKS.includes(view) ? n.notebook===view : true) && (!tag || n.tags.includes(tag)) && terms.every(term => `${n.title} ${n.content} ${n.tags.join(' ')} ${n.notebook}`.toLocaleLowerCase().includes(term))).sort((a,b) => sort==='title' ? a.title.localeCompare(b.title) : Date.parse(b[sort==='created'?'createdAt':'updatedAt'])-Date.parse(a[sort==='created'?'createdAt':'updatedAt']));
}
export function parseBackup(text) {
  const data=JSON.parse(text);
  if (data?.app !== 'SmartNotes' || data?.version !== 1) throw new Error('Choose a backup exported from SmartNotes.');
  return validateNotes(data.notes);
}
export function mergeNotes(existing,incoming) {
  const map=new Map(existing.map(n=>[n.id,n]));
  for(const note of incoming){const old=map.get(note.id);if(!old || Date.parse(note.updatedAt)>Date.parse(old.updatedAt))map.set(note.id,note);}
  return validateNotes([...map.values()]);
}
export const countWords = text => text.trim() ? text.trim().split(/\s+/).length : 0;
export function sampleNotes(){
  const now=Date.now();
  return [
    {title:'Good things start with a thought',content:'Welcome to your little corner of clarity.\n\nUse this space for the ideas, plans, and everyday details you want to come back to. Click any note to make it yours.',notebook:'Personal',color:'cream',tags:['getting started'],pinned:true},
    {title:'A slower kind of Sunday',content:'A few things to make room for:\n\n☐ A long walk, without a destination\n☐ A book and a second cup of coffee\n☐ Something made just for the fun of it',notebook:'Personal',color:'green',tags:['little things','weekend'],pinned:true},
    {title:'Ideas for something new',content:'What if the next project started with a question?\n\nWhat do I keep wishing existed?\nWhat could I make a little simpler?\nWhat would be fun to figure out?',notebook:'Work',color:'pink',tags:['ideas'],pinned:false},
    {title:'Things I want to learn',content:'01  Tell a better story with data\n02  Grow something from a seed\n03  Make a really good bowl of pasta\n\nStart small. Stay curious.',notebook:'Learning',color:'blue',tags:['curiosity'],pinned:false},
    {title:'Make room for the important',content:'This week’s gentle reminder:\n\nChoose one thing that matters. Give it your best hour. Leave a little space for the unexpected.',notebook:'Work',color:'yellow',tags:['weekly reset'],pinned:false},
  ].map((n,i)=>({...n,id:crypto.randomUUID(),archived:false,createdAt:new Date(now-i*3600000).toISOString(),updatedAt:new Date(now-i*3600000).toISOString()}));
}
