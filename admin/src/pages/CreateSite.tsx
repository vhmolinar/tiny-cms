import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';

export default function CreateSite() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'sites'), {
        name: name.trim(),
        ownerId: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
        defaultLanguage: 'en'
      });
      navigate('/');
    } catch (error) {
      console.error("Error creating site", error);
      alert("Failed to create site");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Rocket className="w-12 h-12 text-blue-600 mb-4" />
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Create Your First Site
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          You don't have any sites configured yet. Let's start by creating one.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-10 shadow-xl rounded-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Site Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., My Awesome Blog"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
              >
                {loading ? 'Creating...' : 'Create Site'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
