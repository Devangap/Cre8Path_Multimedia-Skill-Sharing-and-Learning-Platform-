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
    <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-10 mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-black">Create a New Post</h2>
  
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
  
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </div>
  
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          >
            {["Photography", "Videography", "Music", "Graphic Designing", "UI/UX", "Content Creation", "Advertising", "Marketing"].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
  
        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            rows="4"
          />
        </div>
  
        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
  
        {/* Skill Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Skill Level</label>
          <select
            value={skillLevel}
            onChange={e => setSkillLevel(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          >
            {["Beginner", "Intermediate", "Advanced"].map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
  
        {/* Upload Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Images (Max 3)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mt-1 p-2 border rounded"
          />
          {imagePreviews.length > 0 && (
            <div className="mt-2 flex gap-3 flex-wrap">
              {imagePreviews.map((src, idx) => (
                <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="h-24 w-24 object-cover rounded" />
              ))}
            </div>
          )}
        </div>
  
        {/* Upload Video */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload a 30s Video (optional)</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
  
        {/* Visibility */}
        <div className="col-span-2">
          <label className="flex items-center mt-1">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={e => setIsPublic(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Make this post public</span>
          </label>
        </div>
  
        {/* Submit */}
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-[#A367B1] text-white py-3 rounded hover:bg-violet-700 transition text-lg"
          >
            Share Post
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default PostUpload;
