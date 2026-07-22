import React, { useState } from 'react';
import { auth, functions } from '../firebase';
import { signOut } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { useNavigate } from 'react-router-dom';
import { LogOut, Rocket, FileText, Settings, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [publishing, setPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handlePublish = async () => {
    setPublishing(true);
    setPublishMessage('');
    try {
      const publishSite = httpsCallable(functions, 'publishSite');
      const result = await publishSite();
      setPublishMessage((result.data as any).message || 'Site published successfully!');
    } catch (error: any) {
      setPublishMessage(`Error: ${error.message}`);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center">
          <Rocket className="w-6 h-6 text-blue-600 mr-3" />
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Tiny CMS</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg font-medium transition-colors">
            <FileText className="w-5 h-5 mr-3" /> Posts
          </a>
          <a href="#" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5 mr-3" /> Settings
          </a>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Overview</h2>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Total Posts</h3>
                <div className="p-2 bg-blue-50 rounded-lg"><FileText className="w-5 h-5 text-blue-600" /></div>
              </div>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Status</h3>
                <div className="p-2 bg-green-50 rounded-lg"><Rocket className="w-5 h-5 text-green-600" /></div>
              </div>
              <p className="text-3xl font-bold text-gray-900">All systems go</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
