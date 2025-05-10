import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyInputs, setReplyInputs] = useState({});
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [postOwnerEmail, setPostOwnerEmail] = useState('');

  const BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/demo/me`, { credentials: 'include' });
        const data = await res.json();
        setCurrentUserEmail(data.email);
      } catch (err) {
        console.error("Failed to fetch current user", err.message);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/posts/${id}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load post.');
        setPost(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchLikes = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/posts/${id}/likes`);
        const data = await res.json();
        setLikes(data);
      } catch (err) {
        console.error("Failed to fetch likes:", err.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/posts/${id}/comments`, { credentials: 'include' });
        const data = await res.json();
        setPostOwnerEmail(data.postOwnerEmail);
        setComments(data.comments);
      } catch (err) {
        console.error("Failed to fetch comments:", err.message);
      }
    };

    fetchPost();
    fetchLikes();
    fetchComments();
  }, [id]);

  const toggleLike = async () => {
    await fetch(`${BASE_URL}/api/v1/posts/${id}/like`, {
      method: 'POST',
      credentials: 'include',
    });
    const updatedLikes = await fetch(`${BASE_URL}/api/v1/posts/${id}/likes`);
    const likeCount = await updatedLikes.json();
    setLikes(likeCount);
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    await fetch(`${BASE_URL}/api/v1/posts/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content: newComment }),
    });
    setNewComment('');
    await refreshComments();
  };

  const submitReply = async (parentId) => {
    const content = replyInputs[parentId]?.trim();
    if (!content) return;
    await fetch(`${BASE_URL}/api/v1/posts/${id}/comments/${parentId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content }),
    });
    setReplyInputs(prev => ({ ...prev, [parentId]: '' }));
    await refreshComments();
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;
    try {
      const res = await fetch(`${BASE_URL}/api/v1/posts/${id}/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete comment");
      await refreshComments();
    } catch (err) {
      alert(err.message);
    }
  };

  const refreshComments = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/posts/${id}/comments`, { credentials: 'include' });
    const data = await res.json();
    setPostOwnerEmail(data.postOwnerEmail);
    setComments(data.comments);
  };

  const renderComments = (commentList, level = 0) => {
    return commentList.map((c) => (
      <div key={c.id} className={`ml-${level * 4} mt-2`}>
        <div className="bg-gray-100 p-2 rounded text-sm flex justify-between items-start">
          <div>
            <strong className="text-violet-700">{c.authorDisplayName}</strong>: {c.content}
            <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
          </div>
          {(c.authorEmail === currentUserEmail || postOwnerEmail === currentUserEmail) && (
            <button
              onClick={() => handleDeleteComment(c.id)}
              className="text-red-600 text-xs hover:underline ml-2"
            >
              Delete
            </button>
          )}
        </div>
        <div className="flex mt-1">
          <input
            value={replyInputs[c.id] || ''}
            onChange={(e) => setReplyInputs({ ...replyInputs, [c.id]: e.target.value })}
            placeholder="Write a reply..."
            className="flex-1 p-1 border rounded text-xs"
          />
          <button
            onClick={() => submitReply(c.id)}
            className="ml-2 bg-violet-500 text-white text-xs px-2 py-1 rounded"
          >
            Reply
          </button>
        </div>
        {c.replies?.length > 0 && renderComments(c.replies, level + 1)}
      </div>
    ));
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? post.imageUrls.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === post.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  if (error) return <div className="text-red-600 text-center mt-6">Error: {error}</div>;
  if (!post) return <div className="text-center mt-6">Loading post...</div>;

  const hasImages = post.imageUrls && post.imageUrls.length > 0;
  const hasVideo = post.videoUrl && post.videoUrl.trim() !== '';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-black relative h-[35rem]">
          {hasVideo ? (
            <video
              src={`${BASE_URL}${post.videoUrl}`}
              controls
              className="w-full h-full object-cover"
            />
          ) : hasImages ? (
            <div className="w-full h-full relative">
              <img
                src={`${BASE_URL}${post.imageUrls[currentImageIndex]}`}
                alt={`Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {post.imageUrls.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow"
                  >
                    <FaArrowLeft />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow"
                  >
                    <FaArrowRight />
                  </button>
                  <div className="absolute bottom-2 right-4 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    {currentImageIndex + 1} / {post.imageUrls.length}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-white text-center w-full h-full flex items-center justify-center">
              No media available
            </div>
          )}
        </div>

        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-violet-900 mb-3">{post.title}</h1>
            <p className="text-gray-700 mb-2"><strong>Description:</strong> {post.description || 'N/A'}</p>
            <p className="text-gray-700 mb-1"><strong>Category:</strong> {post.category}</p>
            <p className="text-gray-700 mb-1"><strong>Skill Level:</strong> {post.skillLevel}</p>
            <div className="text-gray-700 mb-2">
              <strong>Tags:</strong>{" "}
              <span className="flex flex-wrap gap-2 mt-1">
                {post.tags?.length
                  ? post.tags.map(tag => (
                      <span key={tag} className="bg-violet-100 text-violet-800 px-2 py-1 text-xs rounded-full">#{tag}</span>
                    ))
                  : <span className="text-sm text-gray-500">None</span>}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Posted on: {new Date(post.createdAt).toLocaleString()}</p>
            <p className="text-sm text-gray-500">By: {post.userEmail}</p>

            <div className="flex gap-4 mt-4 items-center">
              <button
                onClick={toggleLike}
                className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full hover:bg-pink-200"
              >
                ❤️ Like
              </button>
              <span className="text-gray-600">{likes} Likes</span>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-gray-800">Comments</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {renderComments(comments)}
              </div>
              <div className="mt-4 flex">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Write a comment..."
                />
                <button
                  onClick={submitComment}
                  className="ml-2 bg-violet-600 text-white px-4 py-2 rounded"
                >
                  Post
                </button>
              </div>
            </div>
          </div>

          <button
            className="mt-6 bg-[#A367B1] text-white px-4 py-2 rounded hover:bg-violet-700 self-start"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
