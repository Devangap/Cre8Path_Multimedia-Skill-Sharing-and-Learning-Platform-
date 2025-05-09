import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PostUpload from "../../components/PostUpload";
import EditPostModal from "../EditPost";

import MyLearningPlans from "../LearningPlans/MyLearningPlans";
import LearningPlanModal from "../LearningPlans/LearningPlanModal";

import EditProfileModal from "./EditProfileModal"; 
import { FaTrashAlt, FaEdit } from "react-icons/fa";



const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [currentTab, setCurrentTab] = useState("posts");
  const [myPosts, setMyPosts] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPostId, setEditingPost] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const isOwnProfile = currentUser?.username === profile?.username;




  // const fetchProfile = async () => {
  //   try {
  //     const res = await fetch(`http://localhost:8080/api/profile/${username}`, {
  //       credentials: "include",
  //     });
  //     const data = await res.json();
  //     setProfile(data);
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };


  // const fetchMyPosts = async () => {
  //   try {
  //     const res = await fetch("http://localhost:8080/api/v1/posts/my-posts", {
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //     });
  //     if (res.ok) {
  //       const data = await res.json();
  //       setMyPosts(data);
  //     }
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };

  useEffect(() => {
    fetchProfile();
    fetchMyPosts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".create-dropdown")) {
        setShowDropdown(false);
      }
    };
  
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
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
  
     
      setMyPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      
    } catch (err) {
      alert("Error: " + err.message);
    }
  };
  

  const renderTabContent = () => {
    switch (currentTab) {
      case "posts":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {myPosts.length === 0 ? (
              <div className="text-center text-gray-600 col-span-full">No posts yet.</div>
            ) : (
              myPosts.map((post) => (
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
                </div>
              ))
            )}
          </div>
        );
      case "learningPlans":
        return <MyLearningPlans />;
      case "learningProgress":
        return <div className="text-center text-gray-500 mt-4">No learning progress yet.</div>;
      default:
        return null;
    }
  };


   // 🔥 For dropdown toggle

   const fetchProfile = async () => {
    try {
      const profileRes = await fetch(`http://localhost:8080/api/profile/${username}`, {
        credentials: "include",
      });
      if (!profileRes.ok) throw new Error("Profile not found");
      const profileData = await profileRes.json();
  
      // 🧠 Fetch follow status separately
      const followRes = await fetch(`http://localhost:8080/api/follow/${username}/status`, {
        credentials: "include",
      });
      const followData = followRes.ok ? await followRes.json() : {};
  
      setProfile({
        ...profileData,
        isFollowing: followData.isFollowing || false,
        followerCount: followData.followerCount || 0,
        followingCount: followData.followingCount || 0,
      });
  
    } catch (err) {
      console.error("Error fetching profile:", err.message);
    }
  };
  
  
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/profile/me", {
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      setCurrentUser(data);
    } catch (err) {
      console.error("Error fetching current user:", err.message);
    }
  };
  
//   const fetchMyPosts = async () => {
//     try {
//       const res = await fetch('http://localhost:8080/api/v1/posts/my-posts', {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//       });
  
//       const data = await res.json();
//       console.log('Fetched my posts:', data);
  
//       if (res.ok) {
//         setMyPosts(data);
//       } else {
//         console.error('Failed to fetch my posts');
//       }
//     } catch (err) {
//       console.error('Error fetching my posts:', err.message);
//     }
//   };
const fetchMyPosts = async () => {
    try {
      let url = '';
  
      if (currentUser?.username === username) {
        console.log(username)
        url = 'http://localhost:8080/api/v1/posts/my-posts';
      } else {
        url = `http://localhost:8080/api/v1/posts/user/${username}`;
      }
  
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
  
      const data = await res.json();
      if (res.ok) {
        setMyPosts(data); // No filtering
      }
       else {
        console.error('Failed to fetch user posts');
      }
    } catch (err) {
      console.error('Error fetching user posts:', err.message);
    }
  };
  
  
  // 🌟 Combine all in one useEffect
  useEffect(() => {
    const init = async () => {
      await fetchCurrentUser();
      await fetchProfile();
    };
  
    init();
  }, [username]);
  
  
  useEffect(() => {
    if (currentUser && username) {
      fetchMyPosts(); 
    }
  }, [currentUser, username]);
  

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

            {isOwnProfile ? (
  <button
    onClick={() => setShowEditProfileModal(true)}
    className="px-6 py-2 rounded text-white hover:opacity-90 transition"
    style={{ backgroundColor: "#A367B1" }}
  >
    Edit Profile
  </button>
) : (
  <button
    onClick={async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/follow/${profile.username}`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!res.ok) throw new Error("Failed to follow/unfollow");
        fetchProfile(); // refresh profile data to update follow status
      } catch (err) {
        alert("Error: " + err.message);
      }
    }}
    className="px-6 py-2 rounded text-white hover:opacity-90 transition"
    style={{ backgroundColor: "#A367B1" }}
  >
    {profile.isFollowing ? "Unfollow" : "Follow"}
  </button>
)}


       {isOwnProfile && (
              <div className="relative">

                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
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
                        alert("Coming soon");
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Create Learning Progress Template
                    </button>
                  </div>
                )}
              </div>

              )}

            </div>
          </div>

          <div className="flex gap-16 mt-8">
            <div className="text-center">
              <h4 className="text-2xl font-bold">{myPosts.length}</h4>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <h4 className="text-2xl font-bold">{profile.followerCount}</h4>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <h4 className="text-2xl font-bold">{profile.followingCount}</h4>
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

      {/* Tabs Section */}
      <div className="mt-24">

        <div className="flex justify-center mb-6 space-x-6 border-b pb-2">
          <button
            onClick={() => setCurrentTab("posts")}
            className={`px-4 py-2 font-semibold ${currentTab === "posts" ? "border-b-4 border-purple-600 text-purple-700" : "text-gray-500"}`}
          >
            Posts
          </button>
          <button
            onClick={() => setCurrentTab("learningPlans")}
            className={`px-4 py-2 font-semibold ${currentTab === "learningPlans" ? "border-b-4 border-purple-600 text-purple-700" : "text-gray-500"}`}
          >
            Learning Plans
          </button>
          <button
            onClick={() => setCurrentTab("learningProgress")}
            className={`px-4 py-2 font-semibold ${currentTab === "learningProgress" ? "border-b-4 border-purple-600 text-purple-700" : "text-gray-500"}`}
          >
            Learning Progress
          </button>
        </div>

        {renderTabContent()}

        {myPosts.length === 0 ? (
          <div className="text-center text-gray-600">No posts yet. Start by creating one!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {myPosts.map((post) => (
    <div
      key={post.id}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 cursor-pointer flex flex-col justify-between"
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      {post.imageUrls && post.imageUrls.length > 0 && (
        <img
          src={`http://localhost:8080${post.imageUrls[0]}`}
          alt={post.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}

      <div className="flex justify-between items-start mb-2">
        <h3 className="text-2xl font-bold text-gray-800 w-2/3 truncate">{post.title}</h3>
        <div className="flex flex-col items-end gap-1 w-1/3">
  <span className="bg-violet-200 text-violet-800 px-3 py-1 text-xs rounded-full">
    {post.category}
  </span>
  <span className="bg-violet-200 text-violet-800 px-3 py-1 text-xs rounded-full">
    {post.skillLevel}
  </span>
</div>

      </div>

      <p className="text-gray-600 text-sm mb-4">
        {post.description ? post.description.substring(0, 100) + "..." : "No description"}
      </p>

      <div className="flex justify-between items-end mt-auto">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-xs text-violet-700 font-semibold">
          {post.tags?.length ? post.tags.map(tag => (
            <span key={tag}>#{tag}</span>
          )) : <span>#NoTags</span>}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 text-lg">
          <button
            title="Edit Post"
            onClick={(e) => {
              e.stopPropagation();
              setEditingPost(post.id);
              setShowEditModal(true);
            }}
            className="text-blue-600 hover:text-blue-800 transition"
          >
            <FaEdit />
          </button>
          <button
            title="Delete Post"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(post.id);
            }}
            className="text-red-600 hover:text-red-800 transition"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

        )}

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

      {showEditModal && (
        <EditPostModal
          postId={editingPostId}
          onClose={() => setShowEditModal(false)}
          refreshPosts={fetchMyPosts}
        />
      )}

      {showEditProfileModal && (
        <EditProfileModal
          initialData={profile}
          onClose={() => setShowEditProfileModal(false)}
          refreshProfile={fetchProfile}
        />
      )}
      
      {location.pathname === "/learning-plans/create" && <LearningPlanModal />}

    </div>
  );
};

export default ProfilePage;
