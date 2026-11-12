import { useState, useEffect } from "react";
import {
  importCanvasCalendar,
  getSavedCanvasEvents,
  addEvent,
  deleteEvent,
  clearAllEvents,
} from "../services/scheduleService";

export default function SchedulePage({ darkMode, setDarkMode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => new Date().toISOString().split("T")[0]);
  const [events, setEvents] = useState([]);
  
  // Modals state
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form inputs
  const [syncInput, setSyncInput] = useState("");
  const [manualTitle, setManualTitle] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEvents(getSavedCanvasEvents());
  }, []);

  const handleSync = async (e) => {
    e.preventDefault();
    if (!syncInput.trim()) return;
    setLoading(true);
    setStatusMsg("");

    try {
      const imported = await importCanvasCalendar(syncInput);
      setEvents(imported);
      setShowSyncModal(false);
      setSyncInput("");
    } catch (err) {
      setStatusMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualEvent = async (e) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    const newManualEvent = {
      title: manualTitle.trim(),
      dateStr: selectedDateStr,
      source: "Personal",
    };

    const updated = await addEvent(newManualEvent);
    setEvents(updated);
    setShowAddModal(false);
    setManualTitle("");
  };

  const handleDelete = async (id) => {
    const updated = await deleteEvent(id);
    setEvents(updated);
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear all events?")) {
      const updated = await clearAllEvents();
      setEvents(updated);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const changeMonth = (offset) => setCurrentDate(new Date(year, month + offset, 1));

  const activeEvents = events.filter((ev) => ev.dateStr === selectedDateStr);

  const textColor = darkMode ? "#f3f4f6" : "#111827";
  const cardBg = darkMode ? "#18181b" : "#f9fafb";
  const borderColor = darkMode ? "#27272a" : "#e4e4e7";

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} aria-hidden="true" />);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const hasEvent = events.some((ev) => ev.dateStr === dateStr);
    const isSelected = selectedDateStr === dateStr;

    cells.push(
      <button
        key={day}
        onClick={() => setSelectedDateStr(dateStr)}
        aria-label={`${monthNames[month]} ${day}, ${year}`}
        style={{
          padding: "10px 0",
          borderRadius: "6px",
          border: isSelected ? "2px solid #E00122" : `1px solid ${borderColor}`,
          background: isSelected ? "#E00122" : cardBg,
          color: isSelected ? "#fff" : textColor,
          fontWeight: isSelected || hasEvent ? "bold" : "normal",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px"
        }}
      >
        <span>{day}</span>
        {hasEvent && (
          <span
            aria-hidden="true"
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: isSelected ? "#fff" : "#E00122"
            }}
          />
        )}
      </button>
    );
  }

  return (
    <section className="page" style={{ padding: "20px", color: textColor }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Schedule</h1>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={() => { setStatusMsg(""); setShowSyncModal(true); }}
            style={{
              background: "#E00122",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            Sync with Canvas
          </button>
        </div>
      </div>

      {events.length > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
          <button
            onClick={handleClearAll}
            style={{ background: "transparent", color: "#E00122", border: "none", fontSize: "0.8rem", cursor: "pointer", textDecoration: "underline" }}
          >
            Clear All Events
          </button>
        </div>
      )}

      {showSyncModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 100 }}>
          <form onSubmit={handleSync} style={{ background: cardBg, color: textColor, padding: "24px", borderRadius: "12px", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "12px", border: `1px solid ${borderColor}` }}>
            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Canvas iCal Sync</h2>
            <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>
              Paste your Canvas calendar iCal link or raw `.ics` text:
            </p>
            <textarea
              rows={3}
              placeholder="https://..."
              value={syncInput}
              onChange={(e) => setSyncInput(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: `1px solid ${borderColor}`, background: darkMode ? "#121212" : "#ffffff", color: textColor, boxSizing: "border-box" }}
            />
            {statusMsg && <p style={{ margin: 0, color: "#E00122", fontSize: "0.8rem" }}>{statusMsg}</p>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button type="button" onClick={() => setShowSyncModal(false)} style={{ padding: "6px 12px", background: darkMode ? "#27272a" : "#f3f4f6", color: textColor, border: `1px solid ${borderColor}`, borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ padding: "6px 14px", background: "#E00122", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>{loading ? "Syncing..." : "Save"}</button>
            </div>
          </form>
        </div>
      )}

      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 100 }}>
          <form onSubmit={handleAddManualEvent} style={{ background: cardBg, color: textColor, padding: "24px", borderRadius: "12px", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "12px", border: `1px solid ${borderColor}` }}>
            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Add Event / Reminder</h2>
            <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>
              Adding for date: <strong>{selectedDateStr}</strong>
            </p>
            <input
              type="text"
              placeholder="e.g. Study Group at Library"
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: `1px solid ${borderColor}`, background: darkMode ? "#121212" : "#ffffff", color: textColor, boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: "6px 12px", background: darkMode ? "#27272a" : "#f3f4f6", color: textColor, border: `1px solid ${borderColor}`, borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
              <button type="submit" style={{ padding: "6px 14px", background: "#E00122", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Add Event</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ border: `1px solid ${borderColor}`, borderRadius: "8px", padding: "16px", marginBottom: "20px", background: cardBg }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <button
            onClick={() => changeMonth(-1)}
            aria-label="Previous Month"
            style={{ border: `1px solid ${borderColor}`, background: darkMode ? "#27272a" : "#f3f4f6", color: textColor, cursor: "pointer", fontSize: "0.9rem", padding: "6px 12px", borderRadius: "4px", fontWeight: "600" }}
          >
            &larr; Prev
          </button>
          <span style={{ fontWeight: "600" }}>{monthNames[month]} {year}</span>
          <button
            onClick={() => changeMonth(1)}
            aria-label="Next Month"
            style={{ border: `1px solid ${borderColor}`, background: darkMode ? "#27272a" : "#f3f4f6", color: textColor, cursor: "pointer", fontSize: "0.9rem", padding: "6px 12px", borderRadius: "4px", fontWeight: "600" }}
          >
            Next &rarr;
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontSize: "0.75rem", opacity: 0.7, marginBottom: "8px" }}>
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
          {cells}
        </div>
      </div>

  
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <h3 style={{ fontSize: "1rem", margin: 0 }}>Events for {selectedDateStr}</h3>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: darkMode ? "#27272a" : "#e4e4e7",
              color: textColor,
              border: `1px solid ${borderColor}`,
              padding: "4px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: "600",
            }}
          >
            + Add Event
          </button>
        </div>

        {activeEvents.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
            {activeEvents.map((ev) => (
              <div
                key={ev.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderLeft: `4px solid ${ev.source === "Personal" ? "#3b82f6" : "#E00122"}`,
                  background: cardBg,
                  borderTop: `1px solid ${borderColor}`,
                  borderRight: `1px solid ${borderColor}`,
                  borderBottom: `1px solid ${borderColor}`,
                  borderRadius: "0 4px 4px 0",
                  fontSize: "0.9rem",
                }}
              >
                <div>
                  <strong style={{ color: textColor, display: "block" }}>{ev.title}</strong>
                  <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>{ev.source || "Canvas"}</span>
                </div>
                <button
                  onClick={() => handleDelete(ev.id)}
                  style={{
                    background: "transparent",
                    color: "#E00122",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "0.85rem", opacity: 0.6, marginTop: "8px" }}>No classes or reminders on this day.</p>
        )}
      </div>
    </section>
  );
}