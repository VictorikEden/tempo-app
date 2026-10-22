import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
function walk(folder){return fs.readdirSync(folder,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(folder,entry.name)):[path.join(folder,entry.name)])}
const files=walk('dist').filter(file=>!file.endsWith('sw.js')).sort();
const hash=createHash('sha256');
for(const file of files)hash.update(file).update(fs.readFileSync(file));
const urls=files.map(file=>file.replaceAll('\\','/').slice(5));
fs.writeFileSync('dist/precache.json',JSON.stringify(urls));
fs.writeFileSync('dist/sw.js',fs.readFileSync('dist/sw.js','utf8').replace('__BUILD_ID__',hash.digest('hex').slice(0,16)));
fs.writeFileSync('dist/.nojekyll','');
console.log(`Prepared ${urls.length} offline assets, including locally stored fonts.`);
