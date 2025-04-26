import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
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

    if (error) {
        return <div className="text-red-600 text-center mt-6">Error: {error}</div>;
    }

    if (!post) {
        return <div className="text-center mt-6">Loading post...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            {post.imageUrl && (
                <img
                    src={`${BASE_URL}${post.imageUrl}`}
                    alt={post.title}
                    className="w-full h-60 object-cover rounded mb-4"
                />
            )}
            <p className="text-gray-700 mb-2"><strong>Description:</strong> {post.description || 'N/A'}</p>
            <p className="text-gray-700 mb-2"><strong>Category:</strong> {post.category}</p>
            <p className="text-gray-700 mb-2"><strong>Skill Level:</strong> {post.skillLevel}</p>
            <p className="text-gray-700 mb-2"><strong>Tags:</strong> {post.tags?.join(', ') || 'None'}</p>
            <p className="text-gray-500 text-sm">Posted on: {new Date(post.createdAt).toLocaleString()}</p>
            <p className="text-gray-500 text-sm">By: {post.userEmail}</p>

            <button
                className="mt-4 bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
                onClick={() => navigate(-1)}
            >
                Go Back
            </button>
        </div>
    );
};

export default PostDetails;
