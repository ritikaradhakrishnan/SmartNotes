import {mkdir,copyFile} from 'node:fs/promises';
await mkdir(new URL('../dist/',import.meta.url),{recursive:true});
for(const name of ['index.html','styles.css','app.mjs','model.mjs']){
  await copyFile(new URL(`../standalone/${name}`,import.meta.url),new URL(`../dist/${name}`,import.meta.url));
}
console.log('Browser edition built in dist/');
