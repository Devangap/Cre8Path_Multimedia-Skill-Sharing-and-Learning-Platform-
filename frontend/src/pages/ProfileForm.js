import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const skillOptions = [
  "Photography", "Videography", "Graphic Designing", "Animation",
  "Music Production", "UI/UX", "Content Creation", "Advertising", "Marketing",
];

const ProfileForm = () => {
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    bio: "",
    skills: [],
    profilePicture: null,
    location: "",
    website: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    formDataToSend.append("skills", JSON.stringify(formData.skills)); // Convert array to string
    if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }
  
    try {
      const res = await fetch("http://localhost:8080/api/profile/create", {
        method: "POST",
        credentials: "include", // to keep session info
        body: formDataToSend,
      });
  
      if (res.ok) {
        alert("Profile created successfully!");
        navigate("/"); // or redirect to /profile/:id
      } else {
        const errorMsg = await res.text();
        alert("Error: " + errorMsg);
      }
    } catch (err) {
      alert("Something went wrong while submitting your profile.");
      console.error(err);
    }
  };
  
  

  const handleSkillToggle = (skill) => {
    const updated = formData.skills.includes(skill)
      ? formData.skills.filter((s) => s !== skill)
      : [...formData.skills, skill];
    setFormData((prev) => ({ ...prev, skills: updated }));
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form onSubmit={handleSubmit} className="bg-white border shadow-md p-6 rounded-lg max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 text-center">Complete Your Profile</h2>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Username</label>
          <input name="username" required value={formData.username} onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-400" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Full Name</label>
          <input name="fullName" value={formData.fullName} onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-400" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-400" rows="3" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Skills (select multiple)</label>
          <div className="grid grid-cols-2 gap-2">
            {skillOptions.map((skill) => {
              const selected = formData.skills.includes(skill);
              return (
                <label key={skill}
                  className={`px-4 py-1 rounded border cursor-pointer text-sm text-center ${selected ? "bg-violet-600 text-white" : "hover:bg-violet-100"}`}>
                  <input type="checkbox" value={skill} checked={selected}
                    onChange={() => handleSkillToggle(skill)} className="hidden" />
                  {skill}
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Profile Picture (PNG only)</label>
          <input
  type="file"
  accept="image/png, image/jpeg"
  onChange={handleFileChange}
  className="w-full text-sm text-gray-600 file:border file:rounded file:px-3 file:py-1 file:text-sm file:bg-violet-100"
/>

        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Location <span className="text-gray-400 text-xs">(optional)</span></label>
          <input name="location" value={formData.location} onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-400" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Website <span className="text-gray-400 text-xs">(optional)</span></label>
          <input name="website" value={formData.website} onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-400" />
        </div>

        <button type="submit"
          className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700 transition">
          Submit Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
