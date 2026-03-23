// Service Worker — 365 com Deus
// Push notifications

self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body || "Hora do teu devocional.",
    icon: data.icon || "/icon-192.png",
    badge: data.badge || "/icon-192.png",
    data: data.data || { url: "/devotional/today" },
    vibrate: [100, 50, 100],
    actions: [
      { action: "open", title: "Abrir devocional" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "365 com Deus", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/devotional/today";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Se já há uma janela aberta, focar nela
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Caso contrário, abrir nova janela
      return clients.openWindow(url);
    })
  );
});
