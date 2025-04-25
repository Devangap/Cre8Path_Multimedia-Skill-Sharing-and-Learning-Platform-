import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyPosts = ({ userEmail: initialUserEmail }) => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState(initialUserEmail);
    const navigate = useNavigate();

    const BASE_URL = 'http://localhost:8080'; // Backend base URL

    // Fetch the current user's email if not provided
    useEffect(() => {
        const fetchUserEmail = async () => {
            if (!initialUserEmail) {
                try {
                    const res = await fetch(`${BASE_URL}/api/v1/me`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                    });

                    if (!res.ok) {
                        throw new Error('Failed to fetch user email.');
                    }

                    const data = await res.json();
                    setUserEmail(data.email);
                } catch (err) {
                    setError('Please log in to view your posts.');
                    setLoading(false);
                    navigate('/login');
                }
            }
        };

        fetchUserEmail();
    }, [initialUserEmail, navigate]);

    // Fetch the user's posts
    useEffect(() => {
        const fetchMyPosts = async () => {
            if (!userEmail) {
                setError('You must be logged in to view your posts.');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${BASE_URL}/api/v1/posts/my-posts`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (res.status === 401) {
                    // Unauthorized - redirect to login
                    setError('Session expired. Please log in again.');
                    setLoading(false);
                    navigate('/login');
                    return;
                }

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || 'Failed to fetch posts.');
                }

                setPosts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (userEmail) {
            fetchMyPosts();
        }
    }, [userEmail, navigate]);

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    const handleDelete = async (postId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;
    
        try {
            const res = await fetch(`http://localhost:8080/api/v1/posts/${postId}/delete`, {
                method: 'DELETE',
                credentials: 'include',
            });
    
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete post.");
    
            alert("Post deleted successfully.");
            navigate('/my-posts'); // ✅ This triggers the redirect
        } catch (err) {
            alert("Error: " + err.message);
        }
    
    };
    

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">My Posts</h2>
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            {posts.length === 0 && !error ? (
                <p className="text-center text-gray-600">You haven't created any posts yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
                            onClick={() => navigate(`/posts/${post.id}`)}
                        >
                            {post.imageUrl && (
                                <img
                                    src={`${BASE_URL}${post.imageUrl}`}
                                    alt={post.title}
                                    className="w-full h-40 object-cover rounded mb-4"
                                />
                            )}
                            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                            <p className="text-gray-600 mb-2">
                                {post.description ? post.description.substring(0, 100) + '...' : 'No description'}
                            </p>
                            <p className="text-sm text-gray-500">Category: {post.category}</p>
                            <p className="text-sm text-gray-500">Skill Level: {post.skillLevel}</p>
                            <p className="text-sm text-gray-500">
                                Tags: {post.tags ? post.tags.join(', ') : 'None'}
                            </p>
                            <p className="text-sm text-gray-500">
                                Created: {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                                {post.isPublic ? 'Public' : 'Private'}
                            </p>
                            <button
                                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={() => handleDelete(post.id)}
                            >
                                Delete
                            </button>
                            <button
                                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ml-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/posts/${post.id}/edit`)}}
                            >
                              Edit
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPosts;