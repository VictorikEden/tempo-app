import assert from 'node:assert/strict';
import {isProductionAsset,configureOfflineSupport} from './lib/pwa.ts';
const origin='https://my-time.example';
for(const path of ['/@vite/client','/node_modules/.vite/deps/react.js','/app/page.tsx','/app/globals.css','/src/app.js','/_next/static/page.js?t=1'])assert.equal(isProductionAsset(path,origin),false,path);
for(const path of ['/_next/static/page-123.js','/_next/static/style-123.css','/icon-192.png'])assert.equal(isProductionAsset(path,origin),true,path);
assert.equal(isProductionAsset('https://another.example/app.js',origin),false);
const removed=[],deleted=[];
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{serviceWorker:{getRegistrations:async()=>[
 {active:{scriptURL:origin+'/sw.js'},unregister:async()=>removed.push('my-time')},
 {active:{scriptURL:origin+'/other-worker.js'},unregister:async()=>removed.push('other')}
]}}});
globalThis.caches={keys:async()=>['my-time-v1','my-time-v2','another-app'],delete:async name=>deleted.push(name)};
await configureOfflineSupport(false);
assert.deepEqual(removed,['my-time']);
assert.deepEqual(deleted,['my-time-v1','my-time-v2']);
console.log('Passed: development assets excluded, production assets accepted, origin isolation, development cleanup preserves unrelated workers and caches.');
