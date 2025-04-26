import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false); // 🔥 For dropdown toggle

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
              <button className="px-6 py-2 rounded text-white hover:opacity-90 transition" style={{ backgroundColor: "#A367B1" }}>
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
      <div className="mt-24 text-center">
        <h3 className="text-lg text-gray-600">No posts yet</h3>
        <p className="text-sm text-gray-400">Start by creating your first post!</p>
      </div>
    </div>
  );
};

export default ProfilePage;
