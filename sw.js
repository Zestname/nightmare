const CACHE='nightmare-v1';
const CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
const EXTRA=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    await c.addAll(CORE);
    for(const u of EXTRA){try{const r=await fetch(u,{mode:'no-cors'});await c.put(u,r)}catch(_){}}
    self.skipWaiting();
  })());
});
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    for(const k of await caches.keys()){if(k!==CACHE)await caches.delete(k)}
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.hostname==='accounts.google.com'||url.hostname==='www.googleapis.com')return;
  const ok=url.origin===location.origin||url.hostname==='cdnjs.cloudflare.com'||url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com';
  if(!ok)return;
  e.respondWith((async()=>{
    try{
      const r=await fetch(req);
      if(r&&(r.ok||r.type==='opaque')){const c=await caches.open(CACHE);c.put(req,r.clone())}
      return r;
    }catch(err){
      const m=await caches.match(req,{ignoreSearch:true});
      if(m)return m;
      if(req.mode==='navigate'){const h=await caches.match('./index.html');if(h)return h}
      throw err;
    }
  })());
});
