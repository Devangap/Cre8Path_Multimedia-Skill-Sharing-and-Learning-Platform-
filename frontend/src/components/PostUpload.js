import React, { useState } from 'react';

const PostUpload = ({ userEmail, setShowPostModal, refreshPosts }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Photography');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tags, setTags] = useState('');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [isPublic, setIsPublic] = useState(true);
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalImages = [...images, ...selectedFiles].slice(0, 3);
    setImages(totalImages);
    setImagePreviews(totalImages.map(file => URL.createObjectURL(file)));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    images.forEach(image => formData.append('images', image));
    if (video) formData.append('video', video);
    tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag)
        .forEach(tag => formData.append('tags', tag));
    formData.append('skillLevel', skillLevel);
    formData.append('isPublic', isPublic.toString());

    try {
      const res = await fetch('http://localhost:8080/api/v1/posts/create', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create post.');

      alert('🎉 Post created successfully!');
      if (refreshPosts) refreshPosts();
      if (typeof setShowPostModal === 'function') setShowPostModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create a New Post</h2>

      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit}>
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
            <option value="Art">Art</option>
            <option value="Music">Music</option>
            <option value="Writing">Writing</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Upload Images (Max 3)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
          {imagePreviews.length > 0 && (
            <div className="mt-2 mb-4">
              <button
                onClick={() => {
                  setImages([]);
                  setImagePreviews([]);
                }}
                type="button"
                className="text-sm text-red-600 hover:underline"
              >
                Clear All Images
              </button>
            </div>
          )}
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {imagePreviews.map((src, idx) => (
              <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="h-24 w-full object-cover rounded" />
            ))}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">Upload a 30s Video (optional)</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full p-2 border rounded"
          />
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

        <button type="submit" className="w-full bg-violet-600 text-white p-2 rounded hover:bg-violet-700">
          Share Post
        </button>
      </form>
    </div>
  );
};

export default PostUpload;
