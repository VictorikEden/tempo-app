/** Development scripts must never enter the offline application cache. */
export function isProductionAsset(url: string, origin: string): boolean {
  const parsed = new URL(url, origin);
  return parsed.origin === origin &&
    !parsed.search &&
    !/^\/(?:@|node_modules\/|app\/|lib\/|src\/)/.test(parsed.pathname) &&
    /\.(?:js|css|woff2?|ttf|png|svg|webp)$/.test(parsed.pathname);
}

export async function configureOfflineSupport(production: boolean): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  if (!production) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.filter(registration => {
      const worker = registration.active || registration.waiting || registration.installing;
      return worker && new URL(worker.scriptURL).pathname === '/sw.js';
    }).map(registration => registration.unregister()));
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('my-time-')).map(name => caches.delete(name)));
    return;
  }
  await navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js', { updateViaCache: 'none',scope:import.meta.env.BASE_URL });
  const registration = await navigator.serviceWorker.ready;
  const urls = performance.getEntriesByType('resource').map(entry => entry.name)
    .filter(url => isProductionAsset(url, location.origin));
  registration.active?.postMessage({ type: 'CACHE_ASSETS', urls });
}

