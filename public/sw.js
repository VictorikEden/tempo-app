const ROOT=new URL('./',self.location.href);
const PREFIX='tempo-'+ROOT.pathname.replace(/[^a-z0-9]/gi,'_')+'-';
const CACHE=PREFIX+'__BUILD_ID__';
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const response=await fetch(new URL('precache.json',ROOT),{cache:'no-store'});
 if(!response.ok)throw Error('Offline asset list unavailable');
 const files=await response.json();const cache=await caches.open(CACHE);
 await cache.addAll([ROOT.href,...files.map(file=>new URL(file,ROOT).href)]);await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==ROOT.origin||!url.pathname.startsWith(ROOT.pathname))return;
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(ROOT.href,copy)))}return response}).catch(async()=>await caches.match(ROOT.href)||Response.error()));return;
 }
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil(clients.matchAll({type:'window'}).then(windows=>{const window=windows.find(window=>window.url.startsWith(ROOT.href));return window?window.focus():clients.openWindow(ROOT.href)}))});
self.addEventListener('push',event=>{let payload;try{payload=event.data?.json()}catch{return}if(typeof payload?.title!=='string'||typeof payload?.body!=='string')return;event.waitUntil(self.registration.showNotification(payload.title,{body:payload.body,tag:payload.id||'tempo'}))});
