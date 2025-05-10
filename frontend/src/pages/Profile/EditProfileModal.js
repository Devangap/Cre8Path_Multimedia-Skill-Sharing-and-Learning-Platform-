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

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  
    if (name === "username") {
      setUsernameError("");
      if (value === initialData.username) return; // Don't check if it's unchanged
  
      setCheckingUsername(true);
      setTimeout(async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/profile/${value}`, {
            method: "GET",
            credentials: "include",
          });
  
          if (res.ok) {
            setUsernameError(" Username is already taken!");
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
      const res = await fetch("http://localhost:8080/api/profile/update", {
        method: "PUT",
        credentials: "include",
        body: formDataToSend,
      });

      if (res.ok) {
        alert("✅ Profile updated successfully!");
        const refreshedProfile = await (await fetch("http://localhost:8080/api/profile/me", {
          credentials: "include",
        })).json();

        if (refreshedProfile.username !== initialData.username) {
          window.location.href = `/profile/${refreshedProfile.username}`;
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
  const [usernameError, setUsernameError] = useState("");
const [checkingUsername, setCheckingUsername] = useState(false);

  const handleDeleteProfile = async () => {
    const confirmed = window.confirm("Are you sure you want to permanently delete your profile?");
    if (!confirmed) return;

    try {
      const res = await fetch("http://localhost:8080/api/profile/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        alert("✅ Profile deleted successfully!");
        await fetch("http://localhost:8080/api/v1/demo/logout", {
          credentials: "include",
        });

        localStorage.removeItem("userIdentifier");
        sessionStorage.removeItem("userIdentifier");
        window.location.href = "/";
      } else {
        const data = await res.json();
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete your profile.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-2xl w-full max-w-3xl overflow-y-auto border border-violet-200">

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-100 hover:text-white text-2xl font-bold">×</button>

        <h2 className="text-2xl font-bold text-center text-black mb-6 drop-shadow-md">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <input
    name="username"
    value={formData.username}
    onChange={handleInputChange}
    required
    className="w-full px-4 py-2 bg-white/80 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
    placeholder="Username"
  />
  {checkingUsername && <p className="text-sm text-blue-600 mt-1">Checking username...</p>}
  {usernameError && <p className="text-sm text-red-500 mt-1">{usernameError}</p>}
          <input name="fullName" value={formData.fullName} onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white/80 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
            placeholder="Full Name"
          />

          <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="3"
            className="col-span-2 w-full px-4 py-2 bg-white/80 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
            placeholder="Bio"
          />

          <div className="col-span-2">
            <label className="block text-white mb-2 text-sm">Skills</label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <button type="button" key={skill}
                  className={`px-4 py-2 border rounded-full text-sm ${
                    formData.skills.includes(skill)
                      ? "bg-[#A367B1] text-white"
                      : "bg-white/70 hover:bg-violet-100"
                  }`}
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <input name="location" value={formData.location} onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white/80 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
            placeholder="Location"
          />
          <input name="website" value={formData.website} onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white/80 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
            placeholder="Website"
          />

          {initialData?.profilePictureUrl && (
            <div className="col-span-2 text-center">
              <p className="text-white text-sm mb-2">Current Profile Picture</p>
              <img
                src={`http://localhost:8080${initialData.profilePictureUrl}`}
                alt="Profile"
                className="w-20 h-20 rounded-full mx-auto border border-white"
              />
            </div>
          )}

          <div className="col-span-2">
            <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange}
              className="w-full text-white"
            />
          </div>

          <div className="col-span-2 flex justify-between gap-4 mt-4">
  <button
    type="submit"
    className="w-1/2 bg-violet-200 text-violet-800 py-3 rounded-xl border-2 border-violet-800  hover:bg-violet-800 hover:text-white transition"
  >
    Save Changes
  </button>

  <button
    type="button"
    onClick={handleDeleteProfile}
    className="w-1/2 bg-violet-200 text-violet-800 py-3 rounded-xl border-2 border-violet-800  hover:bg-violet-800 hover:text-white transition"
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
