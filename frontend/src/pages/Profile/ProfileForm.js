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
        navigate(`/profile/${formData.username}`);
        navigate(0);  

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
    <div className="min-h-screen bg-white px-8 ml-64 py-10">
  <form onSubmit={handleSubmit} className="bg-white border shadow-lg p-10 rounded-2xl w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
    <h2 className="text-3xl font-bold text-gray-800 text-center col-span-2 mb-8">Complete Your Profile</h2>

    {/* Username */}
    <div>
      <label className="block text-sm text-gray-600 mb-1">Username</label>
      <input name="username" required value={formData.username} onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-400" />
    </div>

    {/* Full Name */}
    <div>
      <label className="block text-sm text-gray-600 mb-1">Full Name</label>
      <input name="fullName" value={formData.fullName} onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-400" />
    </div>

    {/* Bio */}
    <div className="col-span-2">
      <label className="block text-sm text-gray-600 mb-1">Bio</label>
      <textarea name="bio" value={formData.bio} onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-400" rows="3" />
    </div>

    {/* Skills */}
    <div className="col-span-2">
      <label className="block text-sm text-gray-600 mb-1">Skills</label>
      <div className="grid grid-cols-2 gap-2">
  {skillOptions.map((skill) => {
    const selected = formData.skills.includes(skill);
    return (
      <label key={skill}
        className={`px-4 py-2 rounded border cursor-pointer text-sm text-center ${selected ? "bg-violet-600 text-white" : "hover:bg-violet-100"}`}>
        <input type="checkbox" value={skill} checked={selected}
          onChange={() => handleSkillToggle(skill)} className="hidden" />
        {skill}
      </label>
    );
  })}
</div>

    </div>

    {/* Location */}
    <div>
      <label className="block text-sm text-gray-600 mb-1">Location</label>
      <input name="location" value={formData.location} onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-400" />
    </div>

    {/* Website */}
    <div>
      <label className="block text-sm text-gray-600 mb-1">Website</label>
      <input name="website" value={formData.website} onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-400" />
    </div>

    {/* Profile Picture */}
    <div className="col-span-2">
      <label className="block text-sm text-gray-600 mb-1">Profile Picture</label>
      <input type="file" accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="w-full text-sm text-gray-600 file:border file:rounded file:px-3 file:py-1 file:text-sm file:bg-violet-100" />
    </div>

    {/* Submit Button */}
    <div className="col-span-2">
      <button type="submit" className="w-full bg-violet-600 text-white py-3 rounded hover:bg-violet-700 transition text-lg">
        Submit Profile
      </button>
    </div>
  </form>
</div>

  );
};

export default ProfileForm;
