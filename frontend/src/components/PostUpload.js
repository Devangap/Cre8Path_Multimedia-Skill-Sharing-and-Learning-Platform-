// src/pages/PostUpload.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostUpload = ({ userEmail }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Photography');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [tags, setTags] = useState('');
    const [skillLevel, setSkillLevel] = useState('Beginner');
    const [isPublic, setIsPublic] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!userEmail) {
            setError('You must be logged in to create a post.');
            return;
        }

        const postData = {
            title,
            description,
            category,
            imageUrl: image ? image.name : '', // Temporary: Use file name
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            skillLevel,
            isPublic
        };

        try {
            const res = await fetch('http://localhost:8080/api/v1/posts/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
                credentials: 'include'
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to create post.');
            }

            alert('Post created successfully!');
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Create a New Post</h2>
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows="4"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="Photography">Photography</option>
                        <option value="Art">Art</option>
                        <option value="Music">Music</option>
                        <option value="Writing">Writing</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Upload Image</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="w-full p-2 border rounded"
                        accept="image/*"
                    />
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="mt-2 w-full h-40 object-cover rounded" />
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Tags (comma-separated)</label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Skill Level</label>
                    <select
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(e.target.value)}
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
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="mr-2"
                        />
                        Make this post public
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-violet-600 text-white p-2 rounded hover:bg-violet-700"
                >
                    Share Post
                </button>
            </form>
        </div>
    );
};

export default PostUpload;