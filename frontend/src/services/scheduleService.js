const STORAGE_KEY = "bearbuddy_canvas_events";

export const fetchSchedule = async () => {
  return getSavedCanvasEvents();
};

export const addEvent = async (event) => {
  const current = getSavedCanvasEvents();
  const updated = [...current, { ...event, id: `manual-${Date.now()}` }];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteEvent = async (eventId) => {
  const current = getSavedCanvasEvents();
  const updated = current.filter((ev) => ev.id !== eventId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearAllEvents = async () => {
  localStorage.removeItem(STORAGE_KEY);
  return [];
};

export function getSavedCanvasEvents() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export async function importCanvasCalendar(icalInput) {
  const input = icalInput.trim();
  let icsText = input;

  // If a URL is pasted, use a public CORS proxy to fetch the raw .ics text
  if (input.startsWith("http")) {
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(input)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error("Failed to fetch Canvas feed URL.");
      icsText = await res.text();
    } catch {
      throw new Error("CORS or network blocked URL fetch. Try pasting the raw .ics text directly.");
    }
  }

  const events = [];
  const blocks = icsText.split("BEGIN:VEVENT");

  blocks.forEach((block, index) => {
    if (index === 0) return;

    const summaryMatch = block.match(/SUMMARY[^\r\n]*:(.*?)(?:\r?\n[A-Z-]+|$)/s) || block.match(/SUMMARY:(.*?)(?:\r?\n)/);
    const dateMatch = block.match(/DTSTART[^:\r\n]*:(\d{4})(\d{2})(\d{2})/);

    if (summaryMatch && dateMatch) {
      const title = summaryMatch[1].replace(/\r?\n\s+/g, "").trim();
      const year = dateMatch[1];
      const month = dateMatch[2];
      const day = dateMatch[3];

      events.push({
        id: `canvas-${index}-${year}${month}${day}-${Math.random().toString(36).substr(2, 4)}`,
        title: title,
        dateStr: `${year}-${month}-${day}`,
        source: "Canvas",
      });
    }
  });

  if (events.length === 0) {
    throw new Error("No valid Canvas events found in this feed or text.");
  }

  const existing = getSavedCanvasEvents();
  const filteredExisting = existing.filter(ev => ev.source !== "Canvas");
  const updated = [...filteredExisting, ...events];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}