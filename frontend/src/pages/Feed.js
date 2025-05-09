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
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-gray-100">
      {posts.length === 0 ? (
        <div className="text-center mt-20 text-gray-600">
          You’re not following anyone or they haven’t posted yet.
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="h-[92vh] snap-start flex flex-col justify-start items-center pt-6"
          >
            <p className="text-md font-semibold text-gray-800 w-full text-left mb-1 max-w-2xl px-4">
              Posted by{" "}
              <span
                className="text-violet-600 hover:underline cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${post.authorUsername}`);
                }}
              >
                @{post.authorUsername || 'unknown'}
              </span>
            </p>

            <div
              className="bg-white rounded-lg shadow-md w-full max-w-2xl p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              {post.imageUrls && post.imageUrls.length > 0 && (
                <img
                  src={`http://localhost:8080${post.imageUrls[0]}`}
                  alt={post.title}
                  className="w-full h-96 object-cover rounded mb-4"
                />
              )}

              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-2">
                {post.description ? post.description : 'No description'}
              </p>

              <p className="text-sm text-gray-500">
                {post.isPublic ? 'Public' : 'Private'} •{' '}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-700 mt-2">
                ❤️ {post.likeCount || 0} Likes • 💬 {post.commentCount || 0} Comments
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;
