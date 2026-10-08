import {STORAGE_KEY,NOTEBOOKS,validateNotes,filterNotes,parseBackup,mergeNotes,countWords,sampleNotes} from './model.mjs';
const $=s=>document.querySelector(s);
let notes=[],view='all',tag='',editing=null,editingVersion=null,baseline='',toastTimer,storageHealthy=true;
const editor=$('#editor');
function toast(message,undo){clearTimeout(toastTimer);const node=$('#toast');node.replaceChildren(document.createTextNode(message));if(undo){const b=document.createElement('button');b.textContent='Undo';b.onclick=()=>{undo();node.hidden=true};node.append(b)}node.hidden=false;toastTimer=setTimeout(()=>node.hidden=true,undo?12000:7000)}
function readNotes(){const raw=localStorage.getItem(STORAGE_KEY);return raw===null?null:validateNotes(JSON.parse(raw));}
function mutate(transform){try{if(!storageHealthy)throw new Error('Storage unavailable');const latest=readNotes()??notes;const next=validateNotes(transform(latest));localStorage.setItem(STORAGE_KEY,JSON.stringify(next));notes=next;render();return true}catch{toast('Could not save. Keep this tab open and export your notes.');return false}}
try{notes=readNotes();if(notes===null){notes=sampleNotes();localStorage.setItem(STORAGE_KEY,JSON.stringify(notes))}}catch{notes=notes??[];storageHealthy=false;toast('Browser storage is unavailable or damaged. Existing data was not overwritten.');}
function element(tagName,className,text){const node=document.createElement(tagName);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node}
function button(label,className,fn,aria){const b=element('button',className,label);b.type='button';b.onclick=fn;if(aria)b.setAttribute('aria-label',aria);return b}
function dateLabel(value){return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric'}).format(new Date(value))}
function changeView(next){view=next;tag='';$('#search').value='';render()}
function render(){
  const active=notes.filter(n=>!n.archived);
  $('#all-count').textContent=active.length;$('#pinned-count').textContent=active.filter(n=>n.pinned).length;$('#archive-count').textContent=notes.filter(n=>n.archived).length;
  document.querySelectorAll('[data-view]').forEach(b=>{const chosen=b.dataset.view===view;b.classList.toggle('active',chosen);b.setAttribute('aria-pressed',String(chosen))});
  const title={all:'All notes',pinned:'Pinned notes',archived:'Archive'}[view]??view;$('#section-title').textContent=title;$('#breadcrumb').textContent=title;
  const filtered=filterNotes(notes,{view,tag,query:$('#search').value,sort:$('#sort').value});$('#result-count').textContent=`${filtered.length} ${filtered.length===1?'note':'notes'}`;
  const availableTags=[...new Set(filterNotes(notes,{view}).flatMap(n=>n.tags))].sort();
  $('#tags').replaceChildren(...['',...availableTags].map(t=>{const b=button(t?`# ${t}`:'All',`tag-filter${tag===t?' active':''}`,()=>{tag=t;render()});b.setAttribute('aria-pressed',String(tag===t));return b}));
  const cards=filtered.map(n=>{
    const card=element('article',`note-card ${n.color}`);const top=element('div','note-top');top.append(element('span','note-category',n.notebook),button(n.pinned?'★':'☆',`pin${n.pinned?' pinned':''}`,()=>mutate(list=>list.map(x=>x.id===n.id?{...x,pinned:!x.pinned}:x)),`${n.pinned?'Unpin':'Pin'} ${n.title}`));
    const open=button('','note-open',()=>openEditor(n.id),`Edit ${n.title}`);open.append(element('h3','',n.title),element('p','note-preview',n.content||'A little room for your next idea…'));
    const tags=element('div','note-tags');tags.append(...n.tags.slice(0,3).map(t=>element('span','note-tag',`# ${t}`)));
    const bottom=element('div','note-bottom');bottom.append(element('span','',`Edited ${dateLabel(n.updatedAt)}`));const actions=element('div','note-actions');actions.append(button(n.archived?'Restore':'Archive','',()=>{if(mutate(list=>list.map(x=>x.id===n.id?{...x,archived:!x.archived}:x)))toast(n.archived?'Note restored':'Note archived')},`${n.archived?'Restore':'Archive'} ${n.title}`),button('Delete','',()=>{if(!confirm(`Delete “${n.title}”? You can undo this for 12 seconds.`))return;if(mutate(list=>list.filter(x=>x.id!==n.id)))toast('Note deleted',()=>mutate(list=>mergeNotes(list,[n])))},`Delete ${n.title}`));bottom.append(actions);card.append(top,open,tags,bottom);return card;
  });
  const isSearching=!!$('#search').value||!!tag;
  if(view!=='archived'&&!isSearching&&filtered.length){const add=button('','add-card',()=>openEditor());add.append(element('span','plus','＋'),element('strong','','A fresh page'),element('small','','What’s on your mind?'));cards.push(add)}
  $('#notes-grid').replaceChildren(...cards);$('#empty').hidden=!!filtered.length;
  $('#empty h3').textContent=isSearching?'No matching thoughts':'No notes here yet';$('#empty p').textContent=isSearching?'Try another word or clear your filters.':'Give your next idea a place to land.';$('#empty-new').hidden=isSearching||view==='archived';
}
for(const name of NOTEBOOKS){const b=button('','nav-item',()=>changeView(name));b.dataset.view=name;const dot=element('span',`notebook-dot ${name.toLowerCase()}`);b.append(dot,document.createTextNode(name));$('#notebooks').append(b)}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>changeView(b.dataset.view));
function draft(){return JSON.stringify({title:$('#note-title').value,content:$('#note-content').value,notebook:$('#note-notebook').value,color:$('#note-color').value,tags:$('#note-tags').value})}
function openEditor(id){const note=notes.find(n=>n.id===id);editing=note?.id??null;editingVersion=note?.updatedAt??null;$('#note-title').value=note?.title??'';$('#note-content').value=note?.content??'';$('#note-notebook').value=note?.notebook??(NOTEBOOKS.includes(view)?view:'Personal');$('#note-color').value=note?.color??'cream';$('#note-tags').value=note?.tags.join(', ')??'';baseline=draft();updateWords();editor.showModal();$('#note-title').focus()}
function closeEditor(){if(draft()!==baseline&&!confirm('Discard your unsaved changes?'))return;editor.close()}
function updateWords(){$('#word-count').textContent=`${countWords($('#note-content').value)} words`}
$('#note-content').oninput=updateWords;
$('#note-form').onsubmit=e=>{e.preventDefault();const title=$('#note-title').value.trim();if(!title){$('#note-title').setCustomValidity('Give your note a title.');$('#note-title').reportValidity();return}const now=new Date().toISOString();const tags=[...new Set($('#note-tags').value.split(',').map(t=>t.trim()).filter(Boolean))];if(tags.length>10||tags.some(t=>t.length>30)){toast('Use up to 10 tags, each 30 characters or fewer.');return}let latest;try{latest=readNotes()??notes}catch{toast('Storage is unavailable. Your draft is still open.');return}const previous=latest.find(n=>n.id===editing);if(editing&&(!previous||previous.updatedAt!==editingVersion)&&!confirm('This note changed in another tab. Save your version as a new note?'))return;const conflict=editing&&(!previous||previous.updatedAt!==editingVersion);const id=conflict?crypto.randomUUID():editing??crypto.randomUUID();const note={id,title,content:$('#note-content').value,notebook:$('#note-notebook').value,color:$('#note-color').value,tags,pinned:conflict?false:previous?.pinned??false,archived:conflict?false:previous?.archived??false,createdAt:conflict?now:previous?.createdAt??now,updatedAt:now};if(mutate(list=>[...list.filter(n=>n.id!==id),note])){editor.close();toast('Note saved on this device')}};
$('#note-title').oninput=()=>$('#note-title').setCustomValidity('');
$('#close-editor').onclick=closeEditor;$('#cancel-edit').onclick=closeEditor;editor.addEventListener('cancel',e=>{e.preventDefault();closeEditor()});
$('#new-note').onclick=()=>openEditor();$('#empty-new').onclick=()=>openEditor();$('#search').oninput=render;$('#sort').onchange=render;
$('#discover').onclick=()=>{changeView('all');$('#search').focus();$('#search').scrollIntoView({behavior:'smooth',block:'center'})};
const info=$('#info-dialog');$('#about').onclick=()=>info.showModal();$('#workspace-info').onclick=()=>info.showModal();$('#close-info').onclick=()=>info.close();
function exportNotes(){const blob=new Blob([JSON.stringify({app:'SmartNotes',version:1,exportedAt:new Date().toISOString(),notes},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=element('a');a.href=url;a.download=`smartnotes-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Backup exported. Keep it somewhere safe.')}
$('#export-notes').onclick=exportNotes;$('#import-notes').onclick=()=>$('#import-file').click();
$('#mobile-export').onclick=exportNotes;$('#mobile-import').onclick=()=>$('#import-file').click();$('#mobile-about').onclick=()=>info.showModal();
$('#import-file').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>20000000)throw new Error('Choose a backup smaller than 20 MB.');const imported=parseBackup(await file.text());if(!confirm(`Import ${imported.length} notes? Existing notes are kept; newer versions of matching notes are used.`))return;if(mutate(list=>mergeNotes(list,imported)))toast(`Imported ${imported.length} notes.`)}catch(error){toast(error instanceof SyntaxError?'This file is not valid JSON.':error.message)}finally{e.target.value=''}};
document.addEventListener('keydown',e=>{if(editor.open||info.open||e.ctrlKey||e.metaKey||e.altKey||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(e.key==='/'){e.preventDefault();$('#search').focus()}if(e.key.toLowerCase()==='n'){e.preventDefault();openEditor()}});
window.addEventListener('storage',e=>{if(e.key===STORAGE_KEY||e.key===null){try{notes=readNotes()??[];storageHealthy=true;render();if(editor.open)toast('Notes changed in another tab. Your current draft is still open.')}catch{toast('Could not read notes from another tab. Export a backup before refreshing.')}}});
window.addEventListener('beforeunload',e=>{if(editor.open&&draft()!==baseline){e.preventDefault();e.returnValue=''}});
render();
