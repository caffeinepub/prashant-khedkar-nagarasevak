import { Bell, BellOff, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  useGetAllNotifications,
  useGetUnreadNotificationCount,
  useMarkAllNotificationsRead,
} from "../hooks/useQueries";

function formatTime(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("mr-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Service Worker Registration ───────────────────────────────────────────────

async function getSwRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;
    return reg;
  } catch {
    return null;
  }
}

async function showSwNotification(
  title: string,
  body: string,
  icon: string,
): Promise<void> {
  // Prefer ServiceWorkerRegistration.showNotification — persists in OS bar
  const reg = await getSwRegistration();
  if (reg) {
    try {
      // Cast to allow vibrate (non-standard but widely supported on Android)
      const opts: NotificationOptions & { vibrate?: number[] } = {
        body,
        icon,
        badge: icon,
        vibrate: [200, 100, 200],
        requireInteraction: false,
        tag: "khedkar-notification",
      };
      await reg.showNotification(title, opts);
      return;
    } catch {
      // fall through to basic Notification
    }
  }
  // Fallback: basic Notification (foreground only)
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body, icon });
  }
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const panelRef = useRef<HTMLDivElement>(null);
  const lastNotifiedIdRef = useRef<string | null>(null);

  const { data: unreadCount = 0n } = useGetUnreadNotificationCount();
  const { data: notifications = [], refetch } = useGetAllNotifications();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  const count = Number(unreadCount);

  // ── Register service worker and get permission on mount ──────────────────────
  useEffect(() => {
    // Register SW early
    getSwRegistration().catch(() => {});

    // Get current permission state
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // ── Request notification permission proactively on first visit ───────────────
  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "default") return;

    // Small delay so it doesn't feel jarring on first load
    const timer = setTimeout(async () => {
      const result = await Notification.requestPermission();
      setPermission(result);
      // Register SW after permission granted
      if (result === "granted") {
        getSwRegistration().catch(() => {});
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // ── Send OS notification when new unread items appear ────────────────────────
  useEffect(() => {
    if (count === 0 || permission !== "granted") return;

    const sorted = [...notifications].sort(
      (a, b) => Number(b.timestamp) - Number(a.timestamp),
    );
    const latest = sorted[0];
    if (!latest) return;

    const latestId = String(latest.id);
    if (latestId === lastNotifiedIdRef.current) return;
    lastNotifiedIdRef.current = latestId;

    showSwNotification(
      latest.title,
      latest.body,
      "/assets/uploads/IMG-20260301-WA0009-1.jpg",
    ).catch(() => {});
  }, [count, notifications, permission]);

  // ── Close on outside click ────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleOpen = () => {
    setOpen((v) => !v);
    if (!open) {
      refetch();
      if (count > 0) {
        markAllRead();
      }
    }
  };

  const handleRequestPermission = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      getSwRegistration().catch(() => {});
    }
  };

  const sorted = [...notifications].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp),
  );

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <motion.button
        type="button"
        onClick={handleOpen}
        whileTap={{ scale: 0.92 }}
        data-ocid="notifications.open_modal_button"
        className="w-12 h-12 rounded-full text-white shadow-xl flex items-center justify-center relative transition-all"
        style={{
          background: open ? "oklch(0.28 0.04 243)" : "oklch(0.52 0.20 43)",
        }}
        aria-label="सूचना पहा"
      >
        <Bell size={20} />
        {count > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full flex items-center justify-center text-white font-bold font-body px-1"
            style={{ background: "oklch(0.55 0.25 25)", fontSize: "0.65rem" }}
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full right-0 mb-3 w-80 rounded-3xl shadow-2xl border overflow-hidden z-[100]"
            style={{
              background: "white",
              borderColor: "oklch(0.28 0.04 243 / 0.10)",
            }}
            data-ocid="notifications.modal"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "oklch(0.28 0.04 243 / 0.08)" }}
            >
              <div className="flex items-center gap-2">
                <Bell size={16} style={{ color: "oklch(0.52 0.20 43)" }} />
                <p
                  className="font-display font-bold text-sm"
                  style={{ color: "oklch(0.28 0.04 243)" }}
                >
                  सूचना
                </p>
                {count > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-white font-bold font-body text-xs"
                    style={{ background: "oklch(0.55 0.25 25)" }}
                  >
                    {count} नवीन
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-ocid="notifications.close_button"
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-muted"
                style={{ color: "oklch(0.55 0.02 243)" }}
                aria-label="बंद करा"
              >
                <X size={14} />
              </button>
            </div>

            {/* Permission prompt */}
            {permission === "default" && (
              <div
                className="px-4 py-3 border-b flex items-center justify-between gap-3"
                style={{
                  background: "oklch(0.65 0.22 43 / 0.06)",
                  borderColor: "oklch(0.65 0.22 43 / 0.15)",
                }}
              >
                <div className="flex items-center gap-2">
                  <BellOff
                    size={14}
                    style={{ color: "oklch(0.52 0.20 43)", flexShrink: 0 }}
                  />
                  <p
                    className="font-body text-xs leading-tight"
                    style={{ color: "oklch(0.38 0.06 43)" }}
                  >
                    मोबाईल सूचना चालू करा
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  data-ocid="notifications.toggle"
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold font-display text-white"
                  style={{ background: "oklch(0.52 0.20 43)" }}
                >
                  चालू करा
                </button>
              </div>
            )}

            {/* Permission denied message */}
            {permission === "denied" && (
              <div
                className="px-4 py-2 border-b flex items-center gap-2"
                style={{
                  background: "oklch(0.55 0.25 25 / 0.06)",
                  borderColor: "oklch(0.55 0.25 25 / 0.12)",
                }}
              >
                <BellOff
                  size={13}
                  style={{ color: "oklch(0.55 0.25 25)", flexShrink: 0 }}
                />
                <p
                  className="font-body text-xs"
                  style={{ color: "oklch(0.45 0.20 25)" }}
                >
                  सूचना ब्राउझर सेटिंग्समधून चालू करा
                </p>
              </div>
            )}

            {/* Notification list */}
            <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
              {sorted.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-10 gap-2"
                  data-ocid="notifications.empty_state"
                >
                  <Bell
                    size={32}
                    className="opacity-20"
                    style={{ color: "oklch(0.52 0.20 43)" }}
                  />
                  <p
                    className="font-body text-sm"
                    style={{ color: "oklch(0.55 0.02 243)" }}
                  >
                    कोणतीही सूचना नाही
                  </p>
                </div>
              ) : (
                sorted.map((n, i) => (
                  <div
                    key={String(n.id)}
                    data-ocid={`notifications.item.${i + 1}`}
                    className="px-4 py-3 border-b last:border-b-0 hover:bg-muted/40 transition-colors"
                    style={{ borderColor: "oklch(0.28 0.04 243 / 0.06)" }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "oklch(0.65 0.22 43 / 0.12)" }}
                      >
                        <Bell
                          size={13}
                          style={{ color: "oklch(0.52 0.20 43)" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-display font-bold text-sm leading-tight"
                          style={{ color: "oklch(0.28 0.04 243)" }}
                        >
                          {n.title}
                        </p>
                        <p
                          className="font-body text-xs leading-relaxed mt-0.5"
                          style={{ color: "oklch(0.45 0.03 243)" }}
                        >
                          {n.body}
                        </p>
                        <p
                          className="font-body text-xs mt-1"
                          style={{ color: "oklch(0.60 0.02 243)" }}
                        >
                          {formatTime(n.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
