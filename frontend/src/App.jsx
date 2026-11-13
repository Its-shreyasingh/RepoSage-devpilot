import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CodebaseChat from './components/CodebaseChat';
import CodeReviewer from './components/CodeReviewer';
import LoginPage from './components/LoginPage';
import { getAuthMe } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('rag'); // 'rag' | 'reviewer'
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoginPage, setIsLoginPage] = useState(false);

  useEffect(() => {
    // Check if URL has ?login parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'true') {
      setIsLoginPage(true);
    }

    async function loadUser() {
      try {
        // First check localStorage for demo user preference
        const savedDemo = localStorage.getItem('reposage_demo_user');
        if (savedDemo) {
          try {
            setUser(JSON.parse(savedDemo));
            setAuthLoading(false);
            return;
          } catch (e) {
            localStorage.removeItem('reposage_demo_user');
          }
        }

        const profile = await getAuthMe();
        setUser(profile);
      } catch (err) {
        console.error('Failed to load user auth profile:', err);
      } finally {
        setAuthLoading(false);
      }
    }

    loadUser();
  }, []);

  const handleLoginSuccess = (profile) => {
    setUser(profile);
    setIsLoginPage(false);
    // Clean URL query param if present
    if (window.location.search.includes('login=')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('reposage_demo_user');
    setUser({
      authenticated: false,
      demoMode: false,
    });
    setIsLoginPage(true);
  };

  if (isLoginPage) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onCancel={() => setIsLoginPage(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        authLoading={authLoading}
        onOpenLogin={() => setIsLoginPage(true)}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'rag' ? (
          <CodebaseChat user={user} />
        ) : (
          <CodeReviewer user={user} />
        )}
      </main>
    </div>
  );
}
