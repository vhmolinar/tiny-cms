import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import Posts from './pages/Posts';
import PostEditor from './pages/PostEditor';
import CreateSite from './pages/CreateSite';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/create-site" element={user ? <CreateSite /> : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />}>
          <Route index element={<Overview />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/:postId" element={<PostEditor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
