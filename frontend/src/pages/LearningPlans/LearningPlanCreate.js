import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LearningPlanCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    objective: "",
    topics: "",
    estimatedDuration: "",
    resources: "",
    visibility: "Public",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/learning-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Learning Plan created successfully!");
        navigate(-1); // Go back to profile
      } else {
        const errorMsg = await res.text();
        alert("Error: " + errorMsg);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded shadow-md max-w-xl w-full mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Create Learning Plan</h2>

      <input
        type="text"
        name="title"
        placeholder="Title"
        required
        className="w-full p-2 border rounded"
        value={formData.title}
        onChange={handleChange}
      />

      <textarea
        name="objective"
        placeholder="Objective"
        required
        className="w-full p-2 border rounded"
        value={formData.objective}
        onChange={handleChange}
      />

      <input
        type="text"
        name="topics"
        placeholder="Topics (comma-separated)"
        required
        className="w-full p-2 border rounded"
        value={formData.topics}
        onChange={handleChange}
      />

      <input
        type="text"
        name="estimatedDuration"
        placeholder="Estimated Duration (e.g. 4 weeks)"
        className="w-full p-2 border rounded"
        value={formData.estimatedDuration}
        onChange={handleChange}
      />

      <textarea
        name="resources"
        placeholder="Resources (e.g. FreeCodeCamp – HTML)"
        className="w-full p-2 border rounded"
        value={formData.resources}
        onChange={handleChange}
      />

      <select
        name="visibility"
        required
        className="w-full p-2 border rounded"
        value={formData.visibility}
        onChange={handleChange}
      >
        <option value="Public">Public</option>
        <option value="Private">Private</option>
      </select>

      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded"
      >
        Save Plan
      </button>
    </form>
  );
};

export default LearningPlanCreate;
