import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PostUpload from "../../components/PostUpload";
import EditPostModal from "../EditPost";
import EditProfileModal from "./EditProfileModal";
import LearningPlanCreate from "../LearningPlans/LearningPlanCreate";
import MyLearningPlans from "../LearningPlans/MyLearningPlans";

import LearningPlanModal from "../LearningPlans/LearningPlanModal";


const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPostId, setEditingPost] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/api/v1/posts/${postId}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete post.");
      }

      alert("Post deleted successfully.");
      setMyPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/profile/${username}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Profile not found");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchProfile();
  }, [username]);

  const fetchMyPosts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/posts/my-posts", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setMyPosts(data);
      } else {
        console.error("Failed to fetch my posts");
      }
    } catch (err) {
      console.error("Error fetching my posts:", err.message);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  if (!profile) {
    return <div className="text-center mt-20 text-gray-500">Loading profile...</div>;
  }

  let skillsArray = [];
  try {
    skillsArray = profile.skills ? JSON.parse(profile.skills) : [];
    if (!Array.isArray(skillsArray)) skillsArray = [];
  } catch (err) {
    skillsArray = [];
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 ml-64 px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-start gap-12">
        <div className="flex flex-col items-center gap-4">
          <img
            src={profile.profilePictureUrl ? `http://localhost:8080${profile.profilePictureUrl}` : "/default-avatar.png"}
            alt="Profile"
            className="rounded-full h-52 w-52 object-cover border-2 border-gray-300"
          />
        </div>

        <div className="flex-1">
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
                        setShowPostModal(true);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Create Post
                    </button>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/learning-plans/create");
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Create Learning Plan
                    </button>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
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

          <div className="mt-4 space-y-1">
            <p className="text-lg text-gray-600">{profile.fullName}</p>
            <p className="text-gray-700">{profile.bio}</p>
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                {profile.website}
              </a>
            )}
          </div>

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

      <div className="mt-24">
        {myPosts.length === 0 ? (
          <div className="text-center text-gray-600">No posts yet. Start by creating one!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                <p className="text-gray-600 text-sm">
                  {post.description ? post.description.substring(0, 80) + "..." : "No description"}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post.id);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPost(post.id);
                      setShowEditModal(true);
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

      <div className="mt-24">
        <h2 className="text-2xl font-bold mb-4">My Learning Plans</h2>
        <MyLearningPlans />
      </div>

      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <button
              onClick={() => setShowPostModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
            >
              ×
            </button>
            <PostUpload userEmail={profile?.email} setShowPostModal={setShowPostModal} refreshPosts={fetchMyPosts} />
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
                const res = await fetch(`http://localhost:8080/api/profile/${username}`, {
                  credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch updated profile");
                const data = await res.json();
                setProfile(data);
              } catch (err) {
                console.error(err.message);
              }
            };
            fetchProfile();
          }}
        />
      )}

      {showEditModal && (
        <EditPostModal
          postId={editingPostId}
          onClose={() => setShowEditModal(false)}
          refreshPosts={fetchMyPosts}
        />
      )}

      {/* {location.pathname === "/learning-plans/create" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
            >
              ×
            </button>
            <LearningPlanCreate />
          </div>
        </div>
      )} */}

      {location.pathname === "/learning-plans/create" && <LearningPlanModal />}



    </div>
  );
};

export default ProfilePage;
