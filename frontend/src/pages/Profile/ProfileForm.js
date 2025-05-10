import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const skillOptions = [
  { value: "Photography", label: "Photography" },
  { value: "Videography", label: "Videography" },
  { value: "Graphic Designing", label: "Graphic Designing" },
  { value: "Animation", label: "Animation" },
  { value: "Music Production", label: "Music Production" },
  { value: "UI/UX", label: "UI/UX" },
  { value: "Content Creation", label: "Content Creation" },
  { value: "Advertising", label: "Advertising" },
  { value: "Marketing", label: "Marketing" },
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

  const [usernameError, setUsernameError] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "username") {
      setUsernameError("");
      setCheckingUsername(true);

      setTimeout(async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/profile/${value}`, {
            method: "GET",
            credentials: "include",
          });

          if (res.ok) {
            setUsernameError("❌ Username is already taken!");
          } else {
            setUsernameError("");
          }
        } catch (err) {
          console.error(err.message);
          setUsernameError("Error checking username");
        } finally {
          setCheckingUsername(false);
        }
      }, 500);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
    } else {
      alert("Only PNG and JPG files are allowed.");
    }
  };

  const handleSkillToggle = (skill) => {
    const updated = formData.skills.includes(skill)
      ? formData.skills.filter((s) => s !== skill)
      : [...formData.skills, skill];
    setFormData((prev) => ({ ...prev, skills: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "skills") {
        formDataToSend.append(key, JSON.stringify(value));
      } else if (key === "profilePicture" && value) {
        formDataToSend.append(key, value);
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      const res = await fetch("http://localhost:8080/api/profile/create", {
        method: "POST",
        credentials: "include",
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

  return (
    <div className="min-h-screen bg-white pl-[260px] flex items-center justify-center px-4 py-8">
  <form
    onSubmit={handleSubmit}
    className="bg-white border border-violet-200 shadow-md p-10 rounded-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
  >

        <h2 className="text-3xl font-bold text-gray-800 text-center col-span-2">Complete Your Profile</h2>

        {/* Username */}
        <div>
          <label className="block text-sm mb-1 text-gray-600">Username</label>
          <input
            name="username"
            required
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-400"
          />
          {checkingUsername && <p className="text-sm text-blue-500 mt-1">Checking username...</p>}
          {usernameError && <p className="text-sm text-red-500 mt-1">{usernameError}</p>}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm mb-1 text-gray-600">Full Name</label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* Bio */}
        <div className="col-span-2">
          <label className="block text-sm mb-1 text-gray-600">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-400"
            rows="2"
          />
        </div>

        {/* Skills */}
<div className="col-span-2">
  <label className="block text-sm mb-1 text-gray-600">Skills</label>
  <Select
    isMulti
    options={skillOptions}
    value={skillOptions.filter((opt) => formData.skills.includes(opt.value))}
    onChange={(selected) => {
      const selectedSkills = selected.map((s) => s.value);
      setFormData((prev) => ({ ...prev, skills: selectedSkills }));
    }}
    className="react-select-container"
    classNamePrefix="react-select"
  />
</div>


        {/* Location */}
        <div>
          <label className="block text-sm mb-1 text-gray-600">Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm mb-1 text-gray-600">Website</label>
          <input
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* Profile Picture */}
        <div className="col-span-2">
          <label className="block text-sm mb-1 text-gray-600">Profile Picture</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="w-full text-sm file:border file:rounded file:px-3 file:py-1 file:text-sm file:bg-violet-100"
          />
        </div>

        {/* Submit */}
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-[#A367B1] text-white py-3 rounded hover:bg-violet-700 transition text-lg"
          >
            Submit Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
