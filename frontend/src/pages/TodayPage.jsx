import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredSession } from '../services/authService';
import { ROUTES } from '../constants/routes';

export default function TodayPage({ darkMode }) {
  const navigate = useNavigate();
  
  // Dynamic time-based greeting (Morning / Afternoon / Evening / Night)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    if (hour < 21) return 'Evening';
    return 'Night';
  };

  // Pull full email prefix (e.g., poudelbp or poudel.bee) and capitalize the first letter
  const session = getStoredSession();
  const rawEmail = session?.user?.email || session?.email || 'poudelbp@mail.uc.edu';
  const emailPrefix = rawEmail.split('@')[0];
  const capitalizedUser = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

  // Load events from localStorage (synced with Schedule / Canvas page)
  const [syncedEvents, setSyncedEvents] = useState([]);
  const [customTasks, setCustomTasks] = useState(() => {
    const saved = localStorage.getItem('bearbuddy_today_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    const storedEvents = localStorage.getItem('bearbuddy_canvas_events');
    if (storedEvents) {
      try {
        setSyncedEvents(JSON.parse(storedEvents));
      } catch (e) {
        setSyncedEvents([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bearbuddy_today_tasks', JSON.stringify(customTasks));
  }, [customTasks]);

  const todayString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();

  const todayDateStr = new Date().toISOString().split('T')[0];
  const todaysScheduleItems = syncedEvents.filter(ev => ev.dateStr === todayDateStr);
  
  const upNextItem = todaysScheduleItems.length > 0 ? todaysScheduleItems[0] : null;
  const remainingScheduleItems = todaysScheduleItems.length > 1 ? todaysScheduleItems.slice(1) : [];

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setCustomTasks([...customTasks, { 
      id: Date.now(), 
      title: inputVal.trim(), 
      location: 'Custom Note / Task', 
      time: 'Today', 
      note: 'Added to your daily list' 
    }]);
    setInputVal('');
  };

  const handleDeleteTask = (id) => {
    setCustomTasks(customTasks.filter((t) => t.id !== id));
  };

  const bg = darkMode ? '#121212' : '#ffffff';
  const textColor = darkMode ? '#f3f4f6' : '#111827';
  const cardBg = darkMode ? '#18181b' : '#f9fafb';
  const borderColor = darkMode ? '#27272a' : '#e4e4e7';
  const subText = darkMode ? '#a1a1aa' : '#6b7280';

  return (
    <div style={{ ...styles.container, backgroundColor: bg, color: textColor }}>
      <div style={styles.topHeader}>
        <span style={styles.dateLabel}>{todayString}</span>
        <h1 style={{ ...styles.greeting, color: textColor }}>
          {getGreeting()}, {capitalizedUser}.
        </h1>
        <p style={{ ...styles.subGreeting, color: subText }}>Your campus plan for today is ready.</p>
      </div>

      {upNextItem ? (
        <div style={{ ...styles.heroCard, backgroundColor: cardBg, borderColor }}>
          <div style={styles.heroHeader}>
            <span style={{ ...styles.upNextTag, color: subText }}>UP NEXT · Today</span>
            <span style={styles.timeBadge}>Active</span>
          </div>

          <h2 style={{ ...styles.classTitle, color: textColor }}>{upNextItem.title}</h2>
          <p style={{ ...styles.classMeta, color: subText }}>{upNextItem.source || 'Canvas Schedule Item'}</p>

          <div style={{ ...styles.walkMeta, backgroundColor: darkMode ? '#000000' : '#ffffff', borderColor }}>
            <span style={styles.walkIcon}>🏫</span>
            <div>
              <div style={{ ...styles.walkText, color: textColor }}>Scheduled for Today</div>
              <div style={{ ...styles.walkSubText, color: subText }}>Check campus map for location</div>
            </div>
          </div>

          <button 
            onClick={() => navigate(ROUTES.MAP)} 
            style={styles.heroButton}
          >
            Get to class <span style={{ marginLeft: '6px' }}>↗</span>
          </button>
        </div>
      ) : (
        <div style={{ ...styles.heroCard, backgroundColor: cardBg, borderColor, textAlign: 'center', padding: '24px' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: textColor }}>No classes up next</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: subText }}>Sync your Canvas schedule or add tasks below!</p>
        </div>
      )}

      <form onSubmit={handleAddTask} style={styles.form}>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Add class, note, or task..."
          style={{ ...styles.input, backgroundColor: cardBg, color: textColor, borderColor }}
        />
        <button type="submit" style={styles.addButton}>Add</button>
      </form>

      <div style={styles.sectionHeader}>
        <h2 style={{ ...styles.sectionTitle, color: textColor }}>The rest of your day</h2>
        <span style={styles.scheduleLink} onClick={() => navigate(ROUTES.SCHEDULE)}>
          Schedule →
        </span>
      </div>

      <div style={styles.listContainer}>
        {remainingScheduleItems.length === 0 && customTasks.length === 0 ? (
          <div style={{ ...styles.emptyState, backgroundColor: cardBg, borderColor }}>
            <p style={styles.emptyText}>No upcoming items. Type above or sync schedule!</p>
          </div>
        ) : (
          <>
            {remainingScheduleItems.map((item) => (
              <div key={item.id} style={{ ...styles.taskCard, backgroundColor: cardBg, borderColor }}>
                <div style={{ ...styles.timeCol, color: textColor }}>Due</div>
                <div style={styles.infoCol}>
                  <div style={{ ...styles.taskTitle, color: textColor }}>{item.title}</div>
                  <div style={styles.taskLocation}>{item.source || 'Canvas'}</div>
                </div>
              </div>
            ))}

            {customTasks.map((task) => (
              <div key={task.id} style={{ ...styles.taskCard, backgroundColor: cardBg, borderColor }}>
                <div style={{ ...styles.timeCol, color: textColor }}>{task.time}</div>
                <div style={styles.infoCol}>
                  <div style={{ ...styles.taskTitle, color: textColor }}>{task.title}</div>
                  <div style={styles.taskLocation}>{task.location}</div>
                  {task.note && <div style={styles.taskNote}>{task.note}</div>}
                </div>
                <button 
                  onClick={() => handleDeleteTask(task.id)} 
                  style={styles.deleteButton}
                  aria-label="Delete item"
                >
                  ✕
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  topHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  dateLabel: {
    fontSize: '0.68rem',
    fontWeight: '700',
    color: '#8e8e93',
    letterSpacing: '0.8px',
    marginBottom: '2px',
  },
  greeting: {
    fontSize: '1.45rem',
    fontWeight: '800',
    margin: '0 0 2px 0',
  },
  subGreeting: {
    fontSize: '0.82rem',
    margin: 0,
  },
  heroCard: {
    borderRadius: '18px',
    padding: '16px',
    borderWidth: '1px',
    borderStyle: 'solid',
    marginBottom: '18px',
    display: 'flex',
    flexDirection: 'column',
  },
  heroHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  upNextTag: {
    fontSize: '0.65rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  timeBadge: {
    backgroundColor: 'rgba(224, 1, 34, 0.15)',
    color: '#ff4d6d',
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '12px',
  },
  classTitle: {
    fontSize: '1.35rem',
    fontWeight: '800',
    margin: '0 0 2px 0',
  },
  classMeta: {
    fontSize: '0.8rem',
    margin: '0 0 14px 0',
  },
  walkMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '12px',
    marginBottom: '14px',
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  walkIcon: {
    fontSize: '1rem',
  },
  walkText: {
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  walkSubText: {
    fontSize: '0.72rem',
  },
  heroButton: {
    width: '100%',
    height: '40px',
    backgroundColor: '#e00122',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '0.88rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    gap: '8px',
    marginBottom: '18px',
  },
  input: {
    flex: 1,
    height: '40px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '10px',
    padding: '0 12px',
    fontSize: '0.85rem',
    outline: 'none',
  },
  addButton: {
    height: '40px',
    padding: '0 16px',
    backgroundColor: '#e00122',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  sectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    margin: 0,
  },
  scheduleLink: {
    fontSize: '0.78rem',
    color: '#e00122',
    fontWeight: '600',
    cursor: 'pointer',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingBottom: '20px',
  },
  emptyState: {
    padding: '20px',
    textAlign: 'center',
    borderRadius: '14px',
    borderWidth: '1px',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#71717a',
    fontSize: '0.8rem',
    margin: 0,
  },
  taskCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 14px',
    borderRadius: '14px',
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  timeCol: {
    width: '60px',
    fontSize: '0.78rem',
    fontWeight: '800',
  },
  infoCol: {
    flex: 1,
    paddingRight: '8px',
  },
  taskTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  taskLocation: {
    fontSize: '0.75rem',
    color: '#71717a',
  },
  taskNote: {
    fontSize: '0.72rem',
    color: '#E00122',
    marginTop: '2px',
  },
  deleteButton: {
    background: 'transparent',
    border: 'none',
    color: '#52525b',
    fontSize: '0.9rem',
    cursor: 'pointer',
    padding: '4px',
  },
};