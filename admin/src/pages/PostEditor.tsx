import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, doc, getDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

export default function PostEditor() {
  const { activeSiteId } = useOutletContext<{ activeSiteId: string }>();
  const navigate = useNavigate();
  const { postId } = useParams();
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(postId !== 'new');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (postId === 'new' || !activeSiteId) return;
    
    const fetchPost = async () => {
      const docRef = doc(db, 'sites', activeSiteId, 'posts', postId!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || '');
        setSlug(data.slug || '');
        setContent(data.content || '');
        setStatus(data.status || 'draft');
      }
      setLoading(false);
    };
    fetchPost();
  }, [postId, activeSiteId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;
    
    setSaving(true);
    const postData = {
      title,
      slug,
      content,
      status,
      authorId: auth.currentUser?.uid,
      updatedAt: serverTimestamp(),
      ...(postId === 'new' ? { createdAt: serverTimestamp() } : {})
    };

    try {
      if (postId === 'new') {
        await addDoc(collection(db, 'sites', activeSiteId, 'posts'), postData);
      } else {
        await setDoc(doc(db, 'sites', activeSiteId, 'posts', postId!), postData, { merge: true });
      }
      navigate('/posts');
    } catch (error) {
      console.error("Error saving post", error);
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-500">Loading editor...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/posts')} className="text-gray-500 hover:text-gray-900 mr-4 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-900">{postId === 'new' ? 'Create Post' : 'Edit Post'}</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="My Awesome Post"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug / URL Path</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="my-awesome-post"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full md:w-1/3 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown supported)</label>
            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
              placeholder="# Heading&#10;Write your post content here..."
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
