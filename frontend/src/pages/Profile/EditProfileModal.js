// src/components/EditProfileModal.jsx
import React, { useState, useEffect } from "react";

const skillOptions = [
  "Photography", "Videography", "Graphic Designing", "Animation",
  "Music Production", "UI/UX", "Content Creation", "Advertising", "Marketing",
];

const EditProfileModal = ({ initialData, onClose, refreshProfile }) => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    bio: "",
    skills: [],
    location: "",
    website: "",
    profilePicture: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        skills: initialData.skills ? JSON.parse(initialData.skills) : [],
        profilePicture: null,
      });
    }
  }, [initialData]);
  const handleDeleteProfile = async () => {
    const confirmed = window.confirm("Are you sure you want to permanently delete your profile?");
    if (!confirmed) return;
  
    try {
      // 1. Delete profile
      const res = await fetch('http://localhost:8080/api/profile/delete', {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert(data.message || "✅ Profile deleted successfully!");
  
        // 2. Call logout endpoint
        await fetch("http://localhost:8080/api/v1/demo/logout", {
          credentials: "include",
        });
  
        // 3. Clear frontend storage
        localStorage.removeItem("userIdentifier");
        sessionStorage.removeItem("userIdentifier");
  
        // 4. Redirect to home
        window.location.href = "/";
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert('❌ Failed to delete your profile.');
    }
  };
  
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skill) => {
    const updated = formData.skills.includes(skill)
      ? formData.skills.filter((s) => s !== skill)
      : [...formData.skills, skill];
    setFormData((prev) => ({ ...prev, skills: updated }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
    } else {
      alert("Only PNG and JPG files are allowed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("website", formData.website);
    formDataToSend.append("skills", JSON.stringify(formData.skills));
    if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }
  
    try {
      const res = await fetch("http://localhost:8080/api/profile/update", {
        method: "PUT",
        credentials: "include",
        body: formDataToSend,
      });
  
      if (res.ok) {
        alert("✅ Profile updated successfully!");
        const refreshedProfileRes = await fetch("http://localhost:8080/api/profile/me", {
          credentials: "include",
        });
  
        if (refreshedProfileRes.ok) {
          const refreshedProfile = await refreshedProfileRes.json();

          if (refreshedProfile.username !== initialData.username) {
            window.location.href = `/profile/${refreshedProfile.username}`;
          } else {
            onClose();
            refreshProfile();
          }
        } else {
          onClose();
          refreshProfile();
        }
      } else {
        const errorMsg = await res.text();
        alert("❌ Error: " + errorMsg);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating your profile.");
    }
  };
  
  
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold">×</button>

        <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-1 text-sm">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Full Name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 text-sm">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="3"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 text-sm">Skills</label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  className={`px-4 py-2 border rounded-full text-sm ${formData.skills.includes(skill) ? 'bg-violet-500 text-white' : 'hover:bg-violet-100'}`}
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Website</label>
            <input
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Show current profile picture if available */}
{initialData?.profilePictureUrl && (
  <div className="flex flex-col items-center mb-4">
    <p className="text-gray-600 text-sm mb-2">Current Profile Picture:</p>
    <img
      src={`http://localhost:8080${initialData.profilePictureUrl}`}
      alt="Current Profile"
      className="w-24 h-24 rounded-full object-cover border border-gray-300"
    />
  </div>
)}
<label className="block mb-1 text-sm">Upload New Profile Picture</label>
<input
  type="file"
  accept="image/png, image/jpeg"
  onChange={handleFileChange}
  className="w-full"
/>


          <div className="col-span-2 mt-4">
            <button type="submit" className="w-full bg-violet-600 text-white py-3 rounded hover:bg-violet-700 transition">
              Save Changes
            </button>
          </div>
          <div className="col-span-2 mt-4">
  <button
    type="button"
    onClick={handleDeleteProfile}  
    className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 transition"
  >
    Delete Profile
  </button>
</div>

        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
