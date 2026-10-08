// This worker only displays user-enabled notifications. It does not cache or intercept requests.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const raw = event.notification.data?.url || '/es/tanusas/agenda';
  const url = new URL(raw, self.location.origin);
  if (url.origin !== self.location.origin || !/^\/(es|en)\/tanusas\/agenda$/.test(url.pathname)) return;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (windows) => {
    const existing = windows.find((client) => new URL(client.url).pathname === url.pathname);
    if (existing) { await existing.navigate(url.href); return existing.focus(); }
    return self.clients.openWindow(url.href);
  }));
