'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../providers/auth-provider';
import { supabase } from '../utils/supabase';

export default function AuthDebug() {
  const { user, session, refreshSession } = useAuth();
  const [cookies, setCookies] = useState<string[]>([]);
  const [localStorageKeys, setLocalStorageKeys] = useState<string[]>([]);
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    // Get cookies
    const allCookies = document.cookie.split(';').map(cookie => cookie.trim());
    setCookies(allCookies);

    // Get localStorage keys
    if (typeof window !== 'undefined') {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) keys.push(key);
      }
      setLocalStorageKeys(keys);

      // Get debug info from localStorage
      const authDebug = localStorage.getItem('authDebug');
      const oauthRedirect = localStorage.getItem('oauthRedirect');
      
      setDebugInfo({
        authDebug: authDebug ? JSON.parse(authDebug) : null,
        oauthRedirect: oauthRedirect ? JSON.parse(oauthRedirect) : null,
      });
    }
  }, []);

  const handleRefreshSession = async () => {
    await refreshSession();
  };

  const handleClearStorage = () => {
    localStorage.removeItem('authDebug');
    localStorage.removeItem('oauthRedirect');
    window.location.reload();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Auth Debug Info</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">User</h3>
        <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
          {user ? JSON.stringify(user, null, 2) : 'No user'}
        </pre>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Session</h3>
        <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
          {session ? JSON.stringify(session, null, 2) : 'No session'}
        </pre>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Cookies</h3>
        <ul className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
          {cookies.map((cookie, index) => (
            <li key={index}>{cookie}</li>
          ))}
        </ul>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">LocalStorage Keys</h3>
        <ul className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
          {localStorageKeys.map((key, index) => (
            <li key={index}>{key}</li>
          ))}
        </ul>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Debug Info</h3>
        <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={handleRefreshSession}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Refresh Session
        </button>
        <button
          onClick={handleClearStorage}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Clear Debug Storage
        </button>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Force Sign Out
        </button>
      </div>
    </div>
  );
} 