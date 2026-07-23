import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useOutletContext, Link } from 'react-router-dom';
import { FileText, Plus, Edit2, Trash2 } from 'lucide-react';

export default function Posts() {
  const { activeSiteId } = useOutletContext<{ activeSiteId: string }>();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeSiteId) return;
    const q = query(collection(db, 'sites', activeSiteId, 'posts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [activeSiteId]);

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deleteDoc(doc(db, 'sites', activeSiteId, 'posts', postId));
    }
  };

  if (loading) return <div className="text-gray-500">Loading posts...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Posts</h3>
        <Link 
          to="/posts/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Link>
      </div>
      
      {posts.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center">
          <FileText className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No posts yet. Create your first one!</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {posts.map(post => (
            <li key={post.id} className="p-6 hover:bg-gray-50 flex justify-between items-center transition-colors">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-1">{post.title}</h4>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                  <span>/{post.slug}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link to={`/posts/${post.id}`} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  <Edit2 className="w-5 h-5" />
                </Link>
                <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
