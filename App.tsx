
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard.tsx';
import { Loader } from './components/Loader.tsx';
import { fetchUserData, fetchAndParseUsers } from './api.ts';
import type { UserData } from './types.ts';
import { SupportLinks } from './components/SupportLinks.tsx';

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [credentials, setCredentials] = useState<Map<string, string> | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('');

  // 1. Fetch credentials from users.txt and set the initial user from the URL or default.
  useEffect(() => {
    const initApp = async () => {
        try {
            const usersMap = await fetchAndParseUsers();
            setCredentials(usersMap);

            const params = new URLSearchParams(window.location.search);
            const userIdFromUrl = params.get('id');
            
            // Set user from URL if valid, otherwise use the default 'J0154'
            const initialUser = userIdFromUrl && usersMap.has(userIdFromUrl) 
                ? userIdFromUrl 
                : 'J0154'; 
            
            setCurrentUser(initialUser);

            // Update the URL to reflect the current user, especially on first load or with an invalid ID.
            if (userIdFromUrl !== initialUser) {
                const newUrl = `${window.location.pathname}?id=${initialUser}${window.location.hash}`;
                window.history.replaceState({ path: newUrl }, '', newUrl);
            }
        } catch (err) {
            setError('Failed to load user credentials. Please check users.txt.');
            setLoading(false);
        }
    };
    initApp();
  }, []);

  // 2. Fetch specific user data whenever the currentUser or credentials map changes.
  useEffect(() => {
    const getData = async () => {
      if (!currentUser || !credentials) {
        return; // Wait until both currentUser and credentials are set
      }
      
      const password = credentials.get(currentUser);
      if (!password) {
        setError(`No credentials found for user: ${currentUser}`);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setUserData(null); // Clear previous user's data before fetching new data
        const data = await fetchUserData(currentUser, password);
        setUserData(data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [currentUser, credentials]);

  // Handles changing the user from the dropdown selector.
  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newUserId = event.target.value;
      setCurrentUser(newUserId);
      // Update the URL to be shareable
      const newUrl = `${window.location.pathname}?id=${newUserId}${window.location.hash}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-slate-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <div className="flex items-center">
            {credentials && credentials.size > 0 && (
              <div className="flex items-center">
                  <label htmlFor="user-select" className="mr-2 text-sm font-medium text-slate-600">Viewing User:</label>
                  <select 
                      id="user-select"
                      value={currentUser}
                      onChange={handleUserChange}
                      className="bg-white border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      aria-label="Select user to view"
                  >
                      {Array.from(credentials.keys()).sort().map(user => (
                          <option key={user} value={user}>{user}</option>
                      ))}
                  </select>
              </div>
            )}
            <SupportLinks currentUser={currentUser} />
          </div>
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8">
        {loading && <Loader />}
        {error && !loading && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
        {userData && !loading && !error && <Dashboard data={userData} />}
      </main>
    </div>
  );
};

export default App;
