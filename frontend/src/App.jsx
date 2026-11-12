// src/App.jsx
import { useCallback, useState, useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';

import Header from './components/Header.jsx';
import Navbar from './components/Navbar.jsx';
import LoginModal from './components/LoginModal.jsx';

import WelcomePage from './pages/WelcomePage.jsx';
import TodayPage from './pages/TodayPage.jsx';
import MapPage from './pages/MapPage.jsx';
import SchedulePage from './pages/SchedulePage.jsx';
import RoutePage from './pages/RoutePage.jsx';
import SecurityPage from './pages/SecurityPage.jsx';

import { ROUTES } from './constants/routes.js';
import { getStoredSession, saveSession, signOut } from './services/authService.js';

function RequireSession({ session }) {
  return session ? <Outlet /> : <Navigate to={ROUTES.WELCOME} replace />;
}

function AppShell({ session, onSignIn, onSignOut, darkMode, setDarkMode, themeStyles }) {
  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: themeStyles.background, color: themeStyles.color }}>
      <Header session={session} onSignIn={onSignIn} onSignOut={onSignOut} />
      
      {/* Theme Toggle Button Row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '6px 16px 2px 16px', background: themeStyles.background }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle Theme"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: darkMode ? '#27272a' : '#f4f4f5',
            color: darkMode ? '#f3f4f6' : '#111827',
            border: darkMode ? '1px solid #3f3f46' : '1px solid #d4d4d8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <main className="app-main" style={{ flex: 1, overflowY: 'auto', width: '100%', background: themeStyles.background, color: themeStyles.color }}>
        <Outlet />
      </main>
      <Navbar darkMode={darkMode} />
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [session, setSession] = useState(getStoredSession);
  const [loginOpen, setLoginOpen] = useState(false);
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("bearbuddy_dark_mode");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("bearbuddy_dark_mode", JSON.stringify(darkMode));
  }, [darkMode]);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const startSession = (next) => {
    saveSession(next);
    setSession(next);
    setLoginOpen(false);
    navigate(ROUTES.TODAY);
  };

  const handleLoginSuccess = (user) => startSession({ user, guest: false });
  const handleGuest = () => startSession({ user: null, guest: true });

  const handleSignOut = async () => {
    await signOut();
    setSession(null);
    navigate(ROUTES.WELCOME);
  };

  // Unified theme object for background and text
  const themeStyles = {
    background: darkMode ? '#121212' : '#ffffff',
    color: darkMode ? '#f3f4f6' : '#111827',
  };

  return (
    <div style={frameStyles.browserWrapper}>
      <div style={{ ...frameStyles.mobileFrame, backgroundColor: themeStyles.background, color: themeStyles.color }}>
        <Routes>
          <Route
            path={ROUTES.WELCOME}
            element={
              session ? (
                <Navigate to={ROUTES.TODAY} replace />
              ) : (
                <WelcomePage onOpenLogin={openLogin} onGuest={handleGuest} />
              )
            }
          />

          <Route element={<RequireSession session={session} />}>
            <Route
              element={
                <AppShell session={session} onSignIn={openLogin} onSignOut={handleSignOut} darkMode={darkMode} setDarkMode={setDarkMode} themeStyles={themeStyles} />
              }
            >
              <Route path={ROUTES.TODAY} element={<TodayPage darkMode={darkMode} />} />
              <Route path={ROUTES.MAP} element={<MapPage darkMode={darkMode} />} />
              <Route path={ROUTES.SCHEDULE} element={<SchedulePage darkMode={darkMode} setDarkMode={setDarkMode} />} />
              <Route path={ROUTES.ROUTE} element={<RoutePage darkMode={darkMode} />} />
              <Route path={ROUTES.SECURITY} element={<SecurityPage darkMode={darkMode} />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to={ROUTES.WELCOME} replace />} />
        </Routes>

        <LoginModal isOpen={loginOpen} onClose={closeLogin} onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}

const frameStyles = {
  browserWrapper: {
    backgroundColor: '#18181b',
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: '20px',
    boxSizing: 'border-box',
  },
  mobileFrame: {
    width: '100%',
    maxWidth: '410px',
    height: '840px',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
};