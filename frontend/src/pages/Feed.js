import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFeed = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/posts/feed', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error("Failed to load feed");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error loading feed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading your feed...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10 ml-64">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Feed</h1>

      {posts.length === 0 ? (
        <p className="text-gray-600">You’re not following anyone or they haven’t posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              {post.imageUrls && post.imageUrls.length > 0 && (
  <img
    src={`http://localhost:8080${post.imageUrls[0]}`}
    alt={post.title}
    className="w-full h-40 object-cover rounded mb-4"
  />
)}

              <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600">
                {post.description ? post.description.substring(0, 80) + '...' : 'No description'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {post.isPublic ? 'Public' : 'Private'} • {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
