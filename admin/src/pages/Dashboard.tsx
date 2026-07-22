import React, { useState, useEffect } from 'react';
import { auth, functions, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { LogOut, Rocket, FileText, LayoutDashboard, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [publishing, setPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');
  
  const [sites, setSites] = useState<any[]>([]);
  const [activeSiteId, setActiveSiteId] = useState<string | null>(null);
  const [loadingSites, setLoadingSites] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'sites'), where('ownerId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSites(fetchedSites);
      
      if (fetchedSites.length === 0) {
        navigate('/create-site');
      } else if (!activeSiteId && fetchedSites.length > 0) {
        setActiveSiteId(fetchedSites[0].id);
      }
      setLoadingSites(false);
    });
    return () => unsubscribe();
  }, [auth.currentUser, navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handlePublish = async () => {
    if (!activeSiteId) return;
    setPublishing(true);
    setPublishMessage('');
    try {
      const publishSite = httpsCallable(functions, 'publishSite');
      const result = await publishSite({ siteId: activeSiteId });
      setPublishMessage((result.data as any).message || 'Site published successfully!');
    } catch (error: any) {
      setPublishMessage(`Error: ${error.message}`);
    } finally {
      setPublishing(false);
    }
  };

  if (loadingSites) {
    return <div className="h-screen flex items-center justify-center bg-gray-50">Loading workspace...</div>;
  }

  const activeSite = sites.find(s => s.id === activeSiteId);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100 flex flex-col">
          <div className="flex items-center mb-4">
            <Rocket className="w-6 h-6 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Tiny CMS</h1>
          </div>
          {activeSite && (
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-800 truncate">{activeSite.name}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className={`flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors ${location.pathname === '/' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link to="/posts" className={`flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors ${location.pathname === '/posts' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
            <FileText className="w-5 h-5 mr-3" /> Posts
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {location.pathname === '/posts' ? 'Posts' : 'Overview'}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{auth.currentUser?.email}</span>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
              >
                {publishing ? 'Publishing...' : 'Publish Site'}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          {publishMessage && (
            <div className={`mb-6 p-4 rounded-lg shadow-sm border ${publishMessage.includes('Error') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
              {publishMessage}
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
}
