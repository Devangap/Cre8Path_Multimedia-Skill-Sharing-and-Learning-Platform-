import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditPost = ({ userEmail }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Photography');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [tags, setTags] = useState('');
    const [skillLevel, setSkillLevel] = useState('Beginner');
    const [isPublic, setIsPublic] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = 'http://localhost:8080';

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/v1/posts/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to load post.');

                setTitle(data.title);
                setDescription(data.description);
                setCategory(data.category);
                setSkillLevel(data.skillLevel);
                setTags(data.tags ? data.tags.join(', ') : '');
                setIsPublic(data.isPublic);
                setImagePreview(`${BASE_URL}${data.imageUrl}`);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPost();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        if (image) formData.append('image', image);
        tags.split(',').map(tag => tag.trim()).filter(tag => tag).forEach(tag => {
            formData.append('tags', tag);
        });
        formData.append('skillLevel', skillLevel);
        formData.append('isPublic', isPublic.toString());

        try {
            const res = await fetch(`${BASE_URL}/api/v1/posts/${id}/update`, {
                method: 'PUT',
                body: formData,
                credentials: 'include',
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update post.');

            alert('Post updated successfully!');
            navigate('/my-posts');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Post</h2>
            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            <form onSubmit={handleUpdate}>
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
                    <label className="block text-gray-700">Update Image (optional)</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="w-full p-2 border rounded"
                        accept="image/*"
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-2 w-full h-40 object-cover rounded"
                        />
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
                    Update Post
                </button>
            </form>
        </div>
    );
};

export default EditPost;
