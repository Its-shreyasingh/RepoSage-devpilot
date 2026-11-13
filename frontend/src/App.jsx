import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CodebaseChat from './components/CodebaseChat';
import CodeReviewer from './components/CodeReviewer';
import { getAuthMe } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('rag'); // 'rag' | 'reviewer'
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
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

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        authLoading={authLoading}
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

