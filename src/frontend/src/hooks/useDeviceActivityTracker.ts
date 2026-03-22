import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "healthos_activity_log";
const MAX_DAYS = 30;

export type ActivityEvent = { ts: number; type: "hidden" | "visible" };

function pruneOldEvents(events: ActivityEvent[]): ActivityEvent[] {
  const cutoff = Date.now() - MAX_DAYS * 24 * 60 * 60 * 1000;
  return events.filter((e) => e.ts >= cutoff);
}

function loadEvents(): ActivityEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ActivityEvent[];
  } catch {
    return [];
  }
}

function saveEvents(events: ActivityEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pruneOldEvents(events)));
}

function padTwo(n: number) {
  return n.toString().padStart(2, "0");
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return `${padTwo(d.getHours())}:${padTwo(d.getMinutes())}`;
}

function getDateKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${padTwo(d.getMonth() + 1)}-${padTwo(d.getDate())}`;
}

export function useDeviceActivityTracker() {
  const [events, setEvents] = useState<ActivityEvent[]>(() => loadEvents());
  const [isTracking, setIsTracking] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) !== null,
  );

  const appendEvent = useCallback(
    (type: "hidden" | "visible") => {
      if (!isTracking) return;
      setEvents((prev) => {
        const updated = pruneOldEvents([...prev, { ts: Date.now(), type }]);
        saveEvents(updated);
        return updated;
      });
    },
    [isTracking],
  );

  useEffect(() => {
    if (!isTracking) return;

    const handleVisibility = () => {
      appendEvent(document.hidden ? "hidden" : "visible");
    };
    const handleUnload = () => {
      const updated = pruneOldEvents([
        ...loadEvents(),
        { ts: Date.now(), type: "hidden" },
      ]);
      saveEvents(updated);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [appendEvent, isTracking]);

  const toggleTracking = useCallback(() => {
    setIsTracking((prev) => {
      if (prev) {
        // Disable: clear storage
        localStorage.removeItem(STORAGE_KEY);
        setEvents([]);
        return false;
      }
      // Enable: init empty
      saveEvents([]);
      return true;
    });
  }, []);

  const daysCollected = (() => {
    const keys = new Set(events.map((e) => getDateKey(e.ts)));
    return keys.size;
  })();

  const exportAsStructuredText = useCallback((): string => {
    // Group by calendar day
    const byDay = new Map<string, ActivityEvent[]>();
    for (const ev of events) {
      const key = getDateKey(ev.ts);
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key)!.push(ev);
    }

    const sortedDays = Array.from(byDay.keys()).sort();
    const lines: string[] = [];
    let dayNum = 0;

    for (const day of sortedDays) {
      const dayEvents = byDay.get(day)!;
      // Need at least one visible+hidden pair
      const hasVisible = dayEvents.some((e) => e.type === "visible");
      const hasHidden = dayEvents.some((e) => e.type === "hidden");
      if (!hasVisible || !hasHidden) continue;

      dayNum++;

      // Last activity: latest hidden after 9pm
      const eveningHidden = dayEvents
        .filter((e) => e.type === "hidden" && new Date(e.ts).getHours() >= 21)
        .sort((a, b) => b.ts - a.ts);
      const lastActivity =
        eveningHidden.length > 0
          ? formatTime(eveningHidden[0].ts)
          : formatTime(
              dayEvents
                .filter((e) => e.type === "hidden")
                .sort((a, b) => b.ts - a.ts)[0]?.ts ?? Date.now(),
            );

      // First activity: earliest visible before noon
      const morningVisible = dayEvents
        .filter((e) => e.type === "visible" && new Date(e.ts).getHours() < 12)
        .sort((a, b) => a.ts - b.ts);
      const firstActivity =
        morningVisible.length > 0
          ? formatTime(morningVisible[0].ts)
          : formatTime(
              dayEvents
                .filter((e) => e.type === "visible")
                .sort((a, b) => a.ts - b.ts)[0]?.ts ?? Date.now(),
            );

      // Night checks: visible events between midnight and 5am
      const nightChecks = dayEvents.filter((e) => {
        const h = new Date(e.ts).getHours();
        return e.type === "visible" && h >= 0 && h < 5;
      });
      const nightCheckStr =
        nightChecks.length > 0
          ? `${nightChecks.length} (${nightChecks.map((e) => formatTime(e.ts)).join(", ")})`
          : "0";

      // Total screen time: sum of visible->hidden pairs, capped at 2h per session
      let totalMs = 0;
      const sorted = dayEvents.slice().sort((a, b) => a.ts - b.ts);
      let lastVisible: number | null = null;
      for (const ev of sorted) {
        if (ev.type === "visible") {
          lastVisible = ev.ts;
        } else if (ev.type === "hidden" && lastVisible !== null) {
          const duration = Math.min(ev.ts - lastVisible, 2 * 60 * 60 * 1000);
          totalMs += duration;
          lastVisible = null;
        }
      }
      const totalMin = Math.round(totalMs / 60000);
      const h = Math.floor(totalMin / 60);
      const m = totalMin % 60;
      const screenTime = `${h}h ${m}m`;

      lines.push(`Day ${dayNum}:`);
      lines.push(`Last activity: ${lastActivity}`);
      lines.push(`First activity: ${firstActivity}`);
      lines.push(`Night checks: ${nightCheckStr}`);
      lines.push(`Total screen time: ${screenTime}`);
      lines.push("");
    }

    return lines.join("\n").trim();
  }, [events]);

  return {
    isTracking,
    toggleTracking,
    events,
    daysCollected,
    exportAsStructuredText,
  };
}
