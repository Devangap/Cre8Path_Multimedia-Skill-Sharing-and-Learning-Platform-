import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostUpload from "../../components/PostUpload";
import { useNavigate } from "react-router-dom";
import EditPostModal from "../EditPost";
import EditProfileModal from "./EditProfileModal"; 


const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const[showPostModal, setShowPostModal] = useState(false); 
  const [myPosts, setMyPosts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false); // For edit modal
  const [editingPostId, setEditingPost] = useState(null); // For the post being edited
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);



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
  
      // ✅ Remove deleted post from UI
      setMyPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      
    } catch (err) {
      alert("Error: " + err.message);
    }
  };
  
 // For postss

   // 🔥 For dropdown toggle

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/profile/${username}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Profile not found");
        const data = await res.json();
        setProfile(data);
        console.log("Profile data:", data); // Debugging line
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchProfile();
  }, [username]);
  const fetchMyPosts = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/posts/my-posts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
  
      const data = await res.json();
      console.log('Fetched my posts:', data);
  
      if (res.ok) {
        setMyPosts(data);
      } else {
        console.error('Failed to fetch my posts');
      }
    } catch (err) {
      console.error('Error fetching my posts:', err.message);
    }
  };
  useEffect(() => {
    fetchMyPosts();
  }, []);
  
  

  if (!profile) {
    return <div className="text-center mt-20 text-gray-500">Loading profile...</div>;
  }

  // Skills safe parsing
  let skillsArray = [];
  try {
    skillsArray = profile.skills ? JSON.parse(profile.skills) : [];
    if (!Array.isArray(skillsArray)) skillsArray = [];
  } catch (err) {
    console.error("Error parsing skills:", err.message);
    skillsArray = [];
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 ml-64 px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-start gap-12">

        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={profile.profilePictureUrl ? `http://localhost:8080${profile.profilePictureUrl}` : "/default-avatar.png"}
            alt="Profile"
            className="rounded-full h-52 w-52 object-cover border-2 border-gray-300"
          />
        </div>

        {/* Profile Details */}
        <div className="flex-1">
          {/* Username and Buttons */}
          <div className="flex items-center gap-6">
            <h2 className="text-3xl font-bold">{profile.username}</h2>
            <div className="relative flex gap-4">
            <button
  onClick={() => setShowEditProfileModal(true)}
  className="px-6 py-2 rounded text-white hover:opacity-90 transition"
  style={{ backgroundColor: "#A367B1" }}
>
  Edit Profile
</button>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="px-4 py-2 rounded text-white hover:opacity-90 transition flex items-center gap-2"
                  style={{ backgroundColor: "#A367B1" }}
                >
                  <span className="text-xl">+</span> Create
                </button>

                {showDropdown && (
  <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-10">
    <button
      onClick={() => {
        setShowDropdown(false);
        setShowPostModal(true); // Open the post modal
        // navigate("/upload"); // Navigate to Upload page
        // Navigate to Create Post page
      }}
      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
    >
       Create Post
    </button>
    <button
      onClick={() => {
        setShowDropdown(false);
        // Navigate to Create Learning Plan page
      }}
      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
    >
       Create Learning Plan
    </button>
    <button
      onClick={() => {
        setShowDropdown(false);
        // Navigate to Create Learning Progress Template page
      }}
      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
    >
      Create Learning Progress Template
    </button>
  </div>
)}

              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-16 mt-8">
            <div className="text-center">
              <h4 className="text-2xl font-bold">0</h4>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <h4 className="text-2xl font-bold">0</h4>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <h4 className="text-2xl font-bold">0</h4>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>

          {/* Full Name, Bio, Website */}
          <div className="mt-4 space-y-1">
            <p className="text-lg text-gray-600">{profile.fullName}</p>
            <p className="text-gray-700">{profile.bio}</p>
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {profile.website}
              </a>
            )}
          </div>

          {/* Skills */}
          {skillsArray.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {skillsArray.map((skill) => (
                  <span key={skill} className="bg-violet-200 text-violet-800 px-3 py-1 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Posts Placeholder */}
      <div className="mt-24">
        {myPosts.length === 0 ? (
          <div className="text-center text-gray-600">No posts yet. Start by creating one!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {myPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                {post.imageUrl && (
                  <img
                    src={`http://localhost:8080${post.imageUrl}`}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 text -sm">
                  {post.description ? post.description?.substring(0, 80) + '...' : 'No description'}
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
                {/* Buttons */}
                <div className="flex gap-2 mt-auto">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex-1"
                    onClick={(e) => {e.stopPropagation();
                      handleDelete(post.id);}}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPost(post.id); // Set the post ID to be edited
                      setShowEditModal(true); // Open the edit modal
                      //navigate(`/posts/${post.id}/edit`);
                    }}
                  >
                    Edit
                  </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-fadeZoom">

            {/* Close button */}
            <button
              onClick={() => setShowPostModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
            >
              ×
            </button>

            {/* Correct passing of email (safe) */}
            <PostUpload 
              userEmail={profile?.email} 
              setShowPostModal={setShowPostModal}
              refreshPosts={fetchMyPosts}  // ✅ This is the missing part you need to add!
            />

          </div>
        </div>
      )}
      {showEditProfileModal && (
  <EditProfileModal
    initialData={profile}
    onClose={() => setShowEditProfileModal(false)}
    refreshProfile={() => {
        const fetchProfile = async () => {
          try {
            const res = await fetch(`http://localhost:8080/api/profile/${username}`, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch updated profile");
            const data = await res.json();
            setProfile(data);
      
            // ✨ If username changed, navigate to new URL
            if (data.username !== username) {
              navigate(`/profile/${data.username}`, { replace: true });
            }
          } catch (err) {
            console.error(err.message);
          }
        };
        fetchProfile();
      }}
      
  />
)}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EditPostModal
            postId={editingPostId}
            onClose={() => setShowEditModal(false)}
            refreshProfile={() => {
                const fetchProfile = async () => {
                  try {
                    const res = await fetch(`http://localhost:8080/api/profile/${username}`, { credentials: "include" });
                    if (!res.ok) throw new Error("Failed to fetch updated profile");
                    const data = await res.json();
                    setProfile(data);
              
                    // ✨ If username changed, navigate to new URL
                    if (data.username !== username) {
                      navigate(`/profile/${data.username}`, { replace: true });
                    }
                  } catch (err) {
                    console.error(err.message);
                  }
                };
                fetchProfile();
              }}
              
          />
        </div>
      )}

    </div>
    
  );
  
};

export default ProfilePage;
