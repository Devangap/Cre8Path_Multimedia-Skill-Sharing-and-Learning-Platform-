import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/posts/${id}`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load post.');
        setPost(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPost();
  }, [id]);

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
    
    {/* Media Section */}
    <div className="md:w-1/2 bg-black relative h-[35rem]">

          {hasImages && (
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
          )}

          {hasVideo && (
            <video
              src={`${BASE_URL}${post.videoUrl}`}
              controls
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Details Section */}
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
