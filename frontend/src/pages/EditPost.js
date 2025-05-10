import React, { useEffect, useState } from 'react';

const EditPostModal = ({ postId, onClose, refreshPosts }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Photography');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [tags, setTags] = useState('');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/posts/${postId}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load post.');

        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setSkillLevel(data.skillLevel);
        setTags(data.tags ? data.tags.join(', ') : '');
        setIsPublic(data.isPublic ?? true);
        setImagePreviews(data.imageUrls.map(url => `${BASE_URL}${url}`));
        if (data.videoUrl) setVideoPreview(`${BASE_URL}${data.videoUrl}`);
      } catch (err) {
        setError(err.message);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalImages = [...images, ...selectedFiles].slice(0, 3);
    setImages(totalImages);
    setImagePreviews(totalImages.map(file => URL.createObjectURL(file)));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    images.forEach((image) => formData.append('images', image));
    if (video) formData.append('video', video);
    tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        .forEach(tag => formData.append('tags', tag));
    formData.append('skillLevel', skillLevel);
    formData.append('isPublic', (isPublic ?? true).toString());

    try {
      const res = await fetch(`${BASE_URL}/api/v1/posts/${postId}/update`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update post.');

      alert('Post updated successfully!');
      if (refreshPosts) refreshPosts();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-fadeZoom">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
      >
        ×
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">Edit Post</h2>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Photography">Photography</option>
            <option value="Videography">Videography</option>
            <option value="Music">Music</option>
            <option value="Graphic Designing">Graphic Designing</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Content Creation">Content Creation</option>
            <option value="Advertising">Advertising</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        {/* Image section */}
        <div className="mb-4">
          <label className="block text-gray-700">Update Images (Max 3)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
          {imagePreviews.length > 0 && (
            <>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {imagePreviews.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="h-32 w-full object-cover rounded"
                  />
                ))}
              </div>
              <div className="mt-2 mb-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setImages([]);
                    setImagePreviews([]);
                  }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Clear All Images
                </button>
              </div>
            </>
          )}
        </div>

        {/* Video section */}
        <div className="mb-4">
          <label className="block text-gray-700">Update Video (optional)</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full p-2 border rounded"
          />
          {videoPreview && (
            <div className="mt-4">
              <video controls className="w-full rounded h-48">
                <source src={videoPreview} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Skill Level</label>
          <select
            value={skillLevel}
            onChange={e => setSkillLevel(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={e => setIsPublic(e.target.checked)}
              className="mr-2"
            />
            Make this post public
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-violet-600 text-white p-2 rounded hover:bg-violet-700"
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPostModal;
